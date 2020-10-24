from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode

from .serializers import AccountSerializer
from ..models import Account
from ..tokens import activate_accounts_token

@api_view(['POST'])
def LoginView(request) :
    data = request.data
    
    if data.get('username') is None or data.get('password') is None :
        resp_data = {'detail': 'Username and password fields are required'}
        return Response(resp_data , status=401, content_type='application/json')

    user = authenticate(request, username=data.get('username'), password=data.get('password'))
    print('user is', user)
    
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
        data_resp = {'success': 'User account is created. you check your email inbox to verifie your account.'}
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