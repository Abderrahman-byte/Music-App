from rest_framework import serializers

from datetime import date, datetime

from ..models import Track, Album, Genre, Artist

class TimeStampField(serializers.Field) :
    def to_representation(self, value) :
        if value is None :
            return None
        
        if type(value) == date :
            return round(datetime(value.year, value.month, value.day).timestamp() * 1000)
        elif type(value) == datetime :
            return round(value.timestamp() * 1000)
        else :
            raise TypeError('TimeStampField support only date and datetime data types.')
        
class GenreSerializer(serializers.ModelSerializer) :
    class meta :
        model = Genre
        fields = ['id', 'name', 'picture']


class TrackSimpleSerializer(serializers.ModelSerializer) :
    release_date = TimeStampField()

    class Meta :
        model = Track
        fields = ['id', 'title', 'release_date', 'rank', 'preview']


class AlbumSimpleSerializer(serializers.ModelSerializer) :
    release_date = TimeStampField()
    genre = GenreSerializer(many=True, read_only=True)
    nb_tracks = serializers.IntegerField(source='track_set.count', read_only=True)

    class Meta :
        model = Album
        fields = ['id', 'title', 'release_date', 'cover_big', 'cover_medium', 'cover_small', 'cover_xl', 'genre', 'nb_tracks']


class ArtistSimpleSerializer(serializers.ModelSerializer) :
    nb_album = serializers.IntegerField(source='album_set.count', read_only=True)

    class Meta :
        model = Artist
        fields = ['id', 'name', 'picture', 'picture_small', 'picture_medium', 'picture_big', 'picture_xl', 'nb_album']


class TrackDetailedSerializer(serializers.ModelSerializer) :
    album = AlbumSimpleSerializer(read_only=True)
    artist = ArtistSimpleSerializer(source='album.artist', read_only=True)
    release_date = TimeStampField()

    class Meta :
        model = Track
        fields = ['id', 'title', 'release_date', 'rank', 'preview', 'album', 'artist']

class AlbumDetailedSerializer(serializers.ModelSerializer) :
    release_date = TimeStampField()
    genre = GenreSerializer(many=True, read_only=True)
    nb_tracks = serializers.IntegerField(source='track_set.count', read_only=True)
    tracks = TrackSimpleSerializer(source='track_set.all', read_only=True, many=True)
    artist = ArtistSimpleSerializer(read_only=True)

    class Meta :
        model = Album
        fields = ['id', 'title', 'release_date', 'cover_big', 'cover_medium', 'cover_small', 'cover_xl', 
        'genre', 'nb_tracks', 'tracks', 'artist']


class ArtistDetailedSerializer(serializers.ModelSerializer) :
    nb_album = serializers.IntegerField(source='album_set.count', read_only=True)
    top = serializers.SerializerMethodField(method_name='get_top')

    class Meta :
        model = Artist
        fields = ['id', 'name', 'picture', 'picture_small', 'picture_medium', 'picture_big', 'picture_xl', 
        'nb_album', 'top']

    def get_top(self, instance) :
        limit = 5
        index = 0
        albums_list = instance.album_set.all()
        albums_ids = [album.id for album in albums_list]
        tracks_list = Track.objects.filter(album_id__in=albums_ids).order_by('-rank')
        nb_tracks = tracks_list.count()
        data =  {
            'data': TrackSimpleSerializer(tracks_list[index:index + limit], many=True).data, 
            'total': nb_tracks,
            'next': f'/api/music/artist/{instance.id}/top?index=5'
        }
        return data