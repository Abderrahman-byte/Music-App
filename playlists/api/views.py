from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PlaylistSimpleSerializer, PlaylistDetailedSerializer
from .permissions import IsAuthorReadOnlyIfPublic
from ..models import TracksPlaylist
from tracks.models import Track


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
        return Response(context, status=200, content_type='application/json')

    def put(self, request, id) :
        try :
            pl = TracksPlaylist.objects.get(pk=id)
        except TracksPlaylist.DoesNotExist :
            return Response({'detail': f'Playlist with id {id} doesnt exist'}, status=404, content_type='application/json')
        
        self.check_object_permissions(request, pl)
        try :
            data = request.data
            pl = PlaylistSimpleSerializer().update(pl, **data)
            context = PlaylistDetailedSerializer(pl).data
            return Response(context, status=201, content_type='application/json')
        except Exception as ex :
            return Response({'detail': ex.__str__()}, content_type='application/json', status=400)

    def post(self, request, id) :
        try :
            pl = TracksPlaylist.objects.get(pk=id)
        except TracksPlaylist.DoesNotExist :
            return Response({'detail': f'Playlist with id {id} doesnt exist'}, status=404, content_type='application/json')
        
        self.check_object_permissions(request, pl)
        data = request.data
        action = data.get('action')
        tracks_ids = data.get('tracks_ids')

        if tracks_ids is None :
            return Response({'detail': 'tracks_ids field is required.'}, status=400, content_type='application/json')
        elif type(tracks_ids) == str :
            tracks_ids = [tracks_ids]
        elif type(tracks_ids) != list :
            return Response({'detail': 'tracks_ids field type unsupported'}, status=400, content_type='application/json')

        try :
            tracks_list = [Track.objects.get(pk=track_id) for track_id in tracks_ids]
        except Track.DoesNotExist :
            return Response({'detail': f'A Track in tracks list doesnt exist'}, status=400, content_type='application/json')

        if action is None :
            return Response({'detail': 'action field is required.'}, status=400, content_type='application/json')
        elif action.lower() == 'add' :
            pl.tracks.add(*tracks_list)
            pl.save()
            return Response({'success': f'add {len(tracks_ids)} items to playlist {id}'}, status=204, content_type='application/json')
        elif action.lower() == 'remove':
            pl.tracks.remove(*tracks_list)
            pl.save()
            return Response({'success': f'add {len(tracks_ids)} items to playlist {id}'}, status=204, content_type='application/json')
        else :
            return Response({'detail': f'Action doesnt exist'}, status=400, content_type='application/json')

    def delete(self, request, id) :
        try :
            pl = TracksPlaylist.objects.get(pk=id)
        except TracksPlaylist.DoesNotExist :
            return Response({'detail': f'Playlist with id {id} doesnt exist'}, status=404, content_type='application/json')
        
        self.check_object_permissions(request, pl)
        pl.delete()
        return Response(status=204)
