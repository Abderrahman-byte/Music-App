from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PlaylistSimpleSerializer, PlaylistDetailedSerializer
from .permissions import IsAuthorReadOnlyIfPublic
from ..models import TracksPlaylist

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
    
    def post(self, request) :
        data = request.data
        validated_data = {
            'user': request.user,
            'title': data.get('title'),
            'is_public': data.get('is_public', True),
            'description': data.get('description'),
        }

        if validated_data.get('title') is None :
            return Response({'detail': 'Playlist title field is required.'}, status=400, content_type='application/json')

        try :
            pl = PlaylistSimpleSerializer().create(**validated_data)
            context = PlaylistSimpleSerializer(pl).data
            return Response(context, status=201, content_type='application/json')
        except Exception as ex :
            return Response({'detail': ex.__str__()}, status=400, content_type='application/json')


class PlaylistDetails(APIView) :
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthorReadOnlyIfPublic]
    
    def get(self, request, id) :
        try :
            pl = TracksPlaylist.objects.get(pk=id)
        except TracksPlaylist.DoesNotExist :
            return Response({'detail': f'Playlist with id {id} doesnt exist'}, status=404, content_type='application/json')
        
        self.check_object_permissions(request, pl)
        context = PlaylistDetailedSerializer(pl).data
        return Response(context, status=201, content_type='application/json')

    def put(self, request, id) :
        try :
            pl = TracksPlaylist.objects.get(pk=id)
        except TracksPlaylist.DoesNotExist :
            return Response({'detail': f'Playlist with id {id} doesnt exist'}, status=404, content_type='application/json')
        
        self.check_object_permissions(request, pl)
        return Response({'detail': f'{id} You can update this'}, status=201, content_type='application/json')

    def post(self, request, id) :
        try :
            pl = TracksPlaylist.objects.get(pk=id)
        except TracksPlaylist.DoesNotExist :
            return Response({'detail': f'Playlist with id {id} doesnt exist'}, status=404, content_type='application/json')
        
        self.check_object_permissions(request, pl)
        return Response({'detail': f'{id} You can post this'}, status=201, content_type='application/json')

    def delete(self, request, id) :
        try :
            pl = TracksPlaylist.objects.get(pk=id)
        except TracksPlaylist.DoesNotExist :
            return Response({'detail': f'Playlist with id {id} doesnt exist'}, status=404, content_type='application/json')
        
        self.check_object_permissions(request, pl)
        return Response({'detail': f'{id} You can delete this'}, status=201, content_type='application/json')
