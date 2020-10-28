from rest_framework import serializers
from django.db import utils

from tracks.api.serializers import TimeStampField, TrackDetailedSerializer, ArtistSimpleSerializer, AlbumSimpleSerializer
from users.api.serializers import AccountSerializer
from ..models import TracksPlaylist, FavoriteTracksList, FavoritePlaylistsList, FavoriteArtistsList, FavoriteAlbumsList

import re, logging

class PlaylistSimpleSerializer(serializers.ModelSerializer) :
    author = AccountSerializer()
    created_date = TimeStampField()
    updated_date = TimeStampField()
    tracks_count = serializers.IntegerField(source='tracks.count')

    class Meta :
        model = TracksPlaylist
        fields = ['id', 'title', 'author', 'is_public', 'created_date', 'updated_date', 'tracks_count']
    
    def create(self, **validated_data) :
        try :
            user = validated_data.get('user')
            title = validated_data.get('title')
            is_public = validated_data.get('is_public', True)
            description = validated_data.get('description')
            playlist = TracksPlaylist(title=title, author=user, is_public=is_public, description=description)
            playlist.save()
            return playlist
        except utils.IntegrityError as ex :
            raise Exception(f'Playlist "{playlist.title}" already exist.')
        except Exception as ex :
            logging.getLogger('errors').error(f'Error in PlaylistSimpleSerializer.create() : {ex.__str__()}')
            raise Exception(f'Something went wrong.')
    
    def update(self, instance, **validated_data) :
        try :
            instance.title = validated_data.get('title', instance.title)
            instance.is_public = validated_data.get('is_public', instance.is_public)
            instance.description = validated_data.get('description', instance.description)
            instance.save()
            return instance
        except utils.IntegrityError as ex :
            raise Exception(f'Playlist "{instance.title}" already exist.')
        except Exception as ex :
            logging.getLogger('errors').error(f'Error in PlaylistSimpleSerializer.create() : {ex.__str__()}')
            raise Exception(f'Something went wrong.')

class PlaylistDetailedSerializer(serializers.ModelSerializer) :
    author = AccountSerializer()
    created_date = TimeStampField()
    updated_date = TimeStampField()
    tracks_count = serializers.IntegerField(source='tracks.count')
    tracks = TrackDetailedSerializer(many=True, read_only=True)

    class Meta :
        model = TracksPlaylist
        fields = ['id', 'title', 'author', 'is_public', 'created_date', 'updated_date', 'tracks_count',
            'tracks', 'description']


# FAVORITE LISTS

class FavoriteTracksSerializer(serializers.Serializer) :
    tracks = TrackDetailedSerializer(many=True, read_only=True)
    tracks_count = serializers.IntegerField(source='tracks.count', read_only=True)


class FavoriteArtistsSerializer(serializers.Serializer) :
    artists = ArtistSimpleSerializer(many=True, read_only=True)
    artists_count = serializers.IntegerField(source='artists.count', read_only=True)

class FavoriteAlbumsSerializer(serializers.Serializer) :
    albums = AlbumSimpleSerializer(many=True, read_only=True)
    albums_count = serializers.IntegerField(source='albums.count', read_only=True)

class FavoritePlaylistsSerializer(serializers.Serializer) :
    playlists = PlaylistSimpleSerializer(many=True, read_only=True)
    playlists_count = serializers.IntegerField(source='playlists.count', read_only=True)