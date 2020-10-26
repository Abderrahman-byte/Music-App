from rest_framework import serializers

from tracks.api.serializers import TimeStampField
from users.api.serializers import AccountSerializer
from ..models import TracksPlaylist

class PlaylistSimpleSerializer(serializers.ModelSerializer) :
    author = AccountSerializer()
    created_date = TimeStampField()
    updated_date = TimeStampField()
    tracks_count = serializers.IntegerField(source='tracks.count')

    class Meta :
        model = TracksPlaylist
        fields = ['id', 'title', 'author', 'is_public', 'created_date', 'updated_date', 'tracks_count']
    
    def create(self, **validated_data) :
        raise Exception('You Forgot to emplement PlaylistSimpleSerializer.create()')
    
    def update(self, instance, **validated_data) :
        raise Exception('You Forgot to emplement PlaylistSimpleSerializer.update()')
    