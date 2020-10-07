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
        

class TrackSimpleSerializer(serializers.ModelSerializer) :
    release_date = TimeStampField()
    
    class Meta :
        model = Track
        fields = ['id', 'title', 'release_date', 'rank', 'preview']