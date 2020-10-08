from rest_framework.decorators import api_view
from rest_framework.response import Response

import logging

from ..models import Track, Album, Artist, Genre
from .serializers import (
    TrackDetailedSerializer, 
    AlbumDetailedSerializer, 
    ArtistDetailedSerializer, 
    AlbumSimpleSerializer
)

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
        'next': f'{request.scheme}://{request.get_host()}/api/music/tracks/top?limit={limit}&index={index + limit}',
        'prev': f'{request.scheme}://{request.get_host()}/api/music/tracks/top?limit={limit}&index={index - limit}' if index - limit >= 0 else None
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


@api_view(['GET'])
def ArtistApiView(request, id) :
    try:
        artist = Artist.objects.get(pk=id)
        serializer = ArtistDetailedSerializer(artist)
        return Response(serializer.data, content_type='application/json')
    except Artist.DoesNotExist :
        return Response({'error': f'Artist with id "{id}" Doesnot exist'}, status=404, content_type='application/json')
    except Exception as ex :
        logging.getLogger('errors').error(f'Request from view "ArtistApiView" error: {ex.__str__()}')
        return Response(status=403)


@api_view(['GET'])
def ArtistTopTracks(request, id) :
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

    try:
        artist = Artist.objects.get(pk=id)
        albums_list = artist.album_set.all()
        albums_ids = [album.id for album in albums_list]
        tracks_list = Track.objects.filter(album_id__in=albums_ids).order_by('-rank')
        nb_tracks = tracks_list.count()

        data =  {
            'data': TrackDetailedSerializer(tracks_list[index:index + limit], many=True).data, 
            'total': nb_tracks,
            'next': f'{request.scheme}://{request.get_host()}/api/music/artist/{artist.id}/top?index={index + limit}&limit={limit}' if index + limit <= nb_tracks else None,
            'prev': f'{request.scheme}://{request.get_host()}/api/music/artist/{artist.id}/top?limit={limit}&index={index - limit}' if index - limit >= 0 else None
        }
        return Response(data, content_type='application/json')
    except Artist.DoesNotExist :
        return Response({'error': f'Artist with id "{id}" Doesnot exist'}, status=404, content_type='application/json')
    except Exception as ex :
        logging.getLogger('errors').error(f'Request from view "ArtistApiView" error: {ex.__str__()}')
        return Response(status=403)


@api_view(['GET'])
def ArtistAlbumApiView(request, id) :
    query = request.query_params
    limit = 5
    index = 0

    try: 
        limit = int(query.get('limit', 5))
    except :
        pass

    try :
        index = int(query.get('index', 0))
    except :
        pass

    try:
        artist = Artist.objects.get(pk=id)
        album_list = artist.album_set.all()
        nb_albums = album_list.count()
        
        data =  {
            'data': AlbumSimpleSerializer(album_list[index:index + limit], many=True).data, 
            'total': nb_albums,
            'next': f'{request.scheme}://{request.get_host()}/api/music/artist/{artist.id}/albums?index={index + limit}&limit={limit}' if index + limit <= nb_albums else None,
            'prev': f'{request.scheme}://{request.get_host()}/api/music/artist/{artist.id}/albums?limit={limit}&index={index - limit}' if index - limit >= 0 else None
        }

        return Response(data, content_type='application/json')
    except Artist.DoesNotExist :
        return Response({'error': f'Artist with id "{id}" Doesnot exist'}, status=404, content_type='application/json')
    except Exception as ex :
        logging.getLogger('errors').error(f'Request from view "ArtistApiView" error: {ex.__str__()}')
        return Response(status=403)