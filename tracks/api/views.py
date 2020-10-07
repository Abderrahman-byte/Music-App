from rest_framework.decorators import api_view
from rest_framework.response import Response

import logging

from ..models import Track, Album, Artist, Genre
from .serializers import TrackDetailedSerializer, AlbumDetailedSerializer

@api_view(['GET'])
def TopTracks(request) :
    query = request.query_params
    limit = 25
    index = 0

    try: 
        limit = int(query.get('limit', 25))
    except :
        pass

    try :
        index = int(query.get('index', 0))
    except :
        pass

    top_tracks = Track.objects.order_by('-rank')[index:index + limit]
    serializer = TrackDetailedSerializer(top_tracks, many=True)
    response_data = {
        'data': serializer.data, 
        'next': f'/api/music/tracks/top?limit={25}&index={index + limit}',
        'prev': f'/api/music/tracks/top?limit={25}&index={index - limit}' if index - limit >= 0 else None
    }
    return Response(response_data, content_type='application/json')


@api_view(['GET'])
def TrackApiView(request, id) :
    try :
        track = Track.objects.get(pk=id)
        serializer = TrackDetailedSerializer(track)
        return Response(serializer.data, content_type='application/json')
    except Track.DoesNotExist :
        return Response({'error': f'Track with id "{id}" Doesnot exist'}, status=404, content_type='application/json')
    except Exception as ex :
        logging.getLogger('errors').error(f'Request from view "TrackApiView" error: {ex.__str__()}')
        return Response(status=403)


@api_view(['GET'])
def AlbumApiView(request, id) :
    try :
        album = Album.objects.get(pk=id)
        serializer = AlbumDetailedSerializer(album)
        return Response(serializer.data, content_type='application/json')
    except Album.DoesNotExist :
        return Response({'error': f'Album with id "{id}" Doesnot exist'}, status=404, content_type='application/json')
    except Exception as ex :
        logging.getLogger('errors').error(f'Request from view "AlbumApiView" error: {ex.__str__()}')
        return Response(status=403)