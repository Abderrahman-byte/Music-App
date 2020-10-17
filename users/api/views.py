from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login

@api_view(['POST'])
def LoginView(request) :
    data = request.data
    
    if data.get('username') is None or data.get('password') is None :
        resp_data = {'detail': 'Username and password fields are required'}
        return Response(resp_data , status=401, content_type='application/json')

    user = authenticate(request, username=data.get('username'), password=data.get('password'))

    if user is None :
        status = 401
        resp_data = {'detail': 'Username or password are wrong'}
    else :
        login(request, user)
        return Response({'success': 'User login successfuly'}, status=200, content_type='application/json')