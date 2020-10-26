from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

api_view(['GET', 'POST'])
authentication_classes([SessionAuthentication])
def UserPlaylists(request) :
    print(request.user)

    return Response({'detail': 'bla bla bla'}, status=200, content_type='application/json')