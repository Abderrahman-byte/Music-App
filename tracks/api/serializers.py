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

    class Meta :
        model = Album
        fields = ['id', 'title', 'release_date', 'cover_big', 'cover_medium', 'cover_small', 'cover_xl', 'genre']

class ArtistSimpleSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Artist
        fields = ['id', 'name', 'picture', 'picture_small', 'picture_medium', 'picture_big', 'picture_xl']