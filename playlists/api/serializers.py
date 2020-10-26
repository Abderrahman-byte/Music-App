from rest_framework import serializers
from django.db import utils

from tracks.api.serializers import TimeStampField
from users.api.serializers import AccountSerializer
from ..models import TracksPlaylist

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
            is_public = validated_data.get('is_publid', True)
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
        raise Exception('You Forgot to emplement PlaylistSimpleSerializer.update()')
    