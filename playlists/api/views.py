from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PlaylistSimpleSerializer

class UserPlaylists(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request) :
        user = request.user
        user_playlists = user.tracksplaylist_set.all()
        user_playlists_count = user.tracksplaylist_set.count()

        context = {
            'data': PlaylistSimpleSerializer(user_playlists, many=True).data,
            'count': user_playlists_count 
        }

        return Response(context, status=200, content_type='application/json')