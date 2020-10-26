from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import utils

from .serializers import (
    PlaylistSimpleSerializer, 
    PlaylistDetailedSerializer, 
    FavoriteTracksSerializer,
    FavoriteArtistsSerializer,
    FavoriteAlbumsSerializer,
    FavoritePlaylistsSerializer
)
from .permissions import IsAuthorReadOnlyIfPublic
from ..models import TracksPlaylist, Follow
from tracks.models import Track, Artist


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
            return Response(status=204, content_type='application/json')
        
        elif action.lower() == 'remove':
            pl.tracks.remove(*tracks_list)
            pl.save()
            return Response(status=204, content_type='application/json')
        
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


class Subscription(APIView) :
    authentication_classes = [SessionAuthentication]

    def post(self, request, id) :
        try :
            artist = Artist.objects.get(pk=id)
        except Artist.DoesNotExist :
            return Response({'detail': 'Artist Doesnt exist.'}, status=404, content_type='application/json')

        user = request.user
        try :
            artist.follow_set.create(user=user)
            artist.save()
            return Response(status=204)
        except utils.IntegrityError :
            return Response({'detail': 'User already following artist'}, status=400, content_type='application/json')

    def delete(self, request, id) :
        try :
            artist = Artist.objects.get(pk=id)
        except Artist.DoesNotExist :
            return Response({'detail': 'Artist Doesnt exist.'}, status=404, content_type='application/json')

        user = request.user
        
        try:
            subscription = Follow.objects.get(user=user, artist=artist)
            subscription.delete()
            return Response(status=204)
        except Follow.DoesNotExist :
            return Response({'detail': 'User cannot unfollow artist.'}, status=404, content_type='application/json')


class FavoriteTracksAPI(APIView) :
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request) :
        user = request.user
        fav_tracks = user.favoritetrackslist
        context = FavoriteTracksSerializer(fav_tracks).data
        return Response(context, status=200, content_type='application/json')
    
    def post(self, request) :
        data = request.data
        track_id = data.get('id')
        user = request.user
        fav_tracks = user.favoritetrackslist

        if track_id is None :
            return Response({'detail': 'id of track is required'}, status=400, content_type='application/json')

        try :
            track = Track.objects.get(pk=track_id)
            fav_tracks.tracks.add(track)
            return Response(status=204)
        except Track.DoesNotExist :
            return Response({'details': f'track with id {track_id} doesnt exist.'}, status=404, content_type='application/json')
    
    def delete(self, request) :
        data = request.data
        track_id = data.get('id')
        user = request.user
        fav_tracks = user.favoritetrackslist

        if track_id is None :
            return Response({'detail': 'id of track is required'}, status=400, content_type='application/json')

        try :
            track = Track.objects.get(pk=track_id)
            fav_tracks.tracks.remove(track)
            return Response(status=204)
        except Track.DoesNotExist :
            return Response({'details': f'track with id {track_id} doesnt exist.'}, status=404, content_type='application/json')
    

class FavoriteArtistsAPI(APIView) :
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request) :
        user = request.user
        fav_artists = user.favoriteartistslist
        context = FavoriteArtistsSerializer(fav_artists).data
        return Response(context, status=200, content_type='application/json')


class FavoriteAlbumsAPI(APIView) :
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request) :
        user = request.user
        fav_albums = user.favoritealbumslist
        context = FavoriteAlbumsSerializer(fav_albums).data
        return Response(context, status=200, content_type='application/json')


class FavoritePlaylistsAPI(APIView) :
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request) :
        user = request.user
        fav_playlists = user.favoriteplaylistslist
        context = FavoritePlaylistsSerializer(fav_playlists).data
        return Response(context, status=200, content_type='application/json')