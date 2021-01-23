from rest_framework.decorators import api_view, parser_classes, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from rest_framework.parsers import FileUploadParser
from django.core.files.storage import FileSystemStorage
from django.conf import settings

from .serializers import AccountSerializer
from ..models import Account
from ..tokens import activate_accounts_token

import os, random, string
from urllib.parse import urljoin

@api_view(['POST'])
def LoginView(request) :
    data = request.data
    
    if data.get('username') is None or data.get('password') is None :
        resp_data = {'detail': 'Username and password fields are required'}
        return Response(resp_data , status=401, content_type='application/json')

    user = authenticate(request, username=data.get('username'), password=data.get('password'))
    
    if user is None :
        status = 401
        resp_data = {'detail': 'Username or password are wrong.'}
    elif not user.is_active :
        status = 401
        resp_data = {'detail': 'Your account has not been activated.'}
    else :
        login(request, user)
        status = 200
        resp_data = {'success': 'User login successfuly.', 'data': AccountSerializer(user).data}
        
    return Response(resp_data, status=status, content_type='application/json')


@api_view(['POST'])
def RegisterView(request) :
    data = request.data
    is_there_error = False
    required_fields = ('username', 'password', 'email', 'first_name', 'last_name')

    for field in required_fields :
        if field not in data :
            is_there_error = True
            field_rep = field.capitalize().replace('_', ' ', 1)
            data_resp = {'detail': f'{field_rep} field is required'}
            status = 400
            break
    if is_there_error : return Response(data_resp, status=status, content_type='application/json')
    validated_data = dict([(field, data.get(field)) for field in required_fields])

    try :
        account =  AccountSerializer().create(**validated_data)
        data_resp = {'success': 'User account is created. Please check your email inbox to verifie your account.'}
        status = 201
    except Exception as ex :
        data_resp = {'detail': ex.__str__()}
        status = 400

    return Response(data_resp, status=status, content_type='application/json')


@api_view(['GET'])
def ActivateAccount(request, uidb64, token) :
    user_id = force_text(urlsafe_base64_decode(uidb64))

    try :
        account = Account.objects.get(pk=user_id)
    except Account.DoesNotExist :
        return Response({'detail': 'Activation link is invalid!'}, status=400, content_type='application/json')

    if not activate_accounts_token.check_token(account, token) :
        return Response({'detail': 'Activation link is invalid!'}, status=400, content_type='application/json')

    if account.is_active : 
        return Response({'success': 'Account is already activated'}, status=200, content_type='application/json')

    account.is_active = True
    account.save()
    login(request, account)
    serializer = AccountSerializer(account)

    return Response({'data': serializer.data, 'success': 'User account has been activated'}, content_type='application/json')


class AccountDetails(APIView) :
    
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request) :
        user = request.user
        context = AccountSerializer(user).data
        return Response(context, content_type='application/json')

    def put(self, request) :
        data = request.data
        user = request.user
        validated_data = {
            'username': data.get('username'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'email': data.get('email')
        }
        validated_data = dict([(key, val)for key, val in validated_data.items() if val is not None])
        
        try :
            AccountSerializer().update(user, **validated_data)
            return Response(status=204)
        except Exception as ex :
            return Response({'detail': ex.__str__()}, status=400, content_type='application/json')


@api_view(['POST'])
def LogoutView(request) :
    logout(request)
    return Response(status=204)
    

@parser_classes([FileUploadParser])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def UpdateAvatar(request):
    avatar_file = request.FILES.get('avatar')

    if avatar_file is None :
        return Response({'details': 'Avatar field is required'}, status=400, content_type='application/json')

    name_chars = list(string.ascii_letters + string.digits)
    random.shuffle(name_chars)

    fs = FileSystemStorage()
    fn, ext = os.path.splitext(avatar_file.name)
    file_id = ''.join([random.choice(name_chars) for _ in range(11)])

    filename = fs.save(f'users/avatars/{file_id}{ext}', avatar_file)
    url = fs.url(filename)
    
    request.user.avatar = url.lstrip('/').lstrip('media')
    request.user.save()

    context = {
        'url': urljoin(f'{settings.SITE_PROTO}://{settings.ROOT_HOSTCONF}', url.lstrip('/'))
    }

    return Response(context, content_type='application/json', status=201)