from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login

from .serializers import AccountSerializer

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
    if data.get('username') is None : 
        data_resp = {'detail': 'Username field is required'}
        status = 400
    
    elif data.get('first_name') is None : 
        data_resp = {'detail': 'First name field is required'}
        status = 400
    
    elif data.get('last_name') is None : 
        data_resp = {'detail': 'Last name field is required'}
        status = 400

    elif data.get('email') is None : 
        data_resp = {'detail': 'Email field is required'}
        status = 400

    elif data.get('password') is None : 
        data_resp = {'detail': 'passwrd field is required'}
        status = 400
    
    try :
        account =  AccountSerializer().create(**data)
        data_resp = {'success': 'User account is created. you check your email inbox to verifie your account.'}
        status = 201
    except Exception as ex :
        data_resp = {'detail': ex.__str__()}
        status = 400

    return Response(data_resp, status=status, content_type='application/json')