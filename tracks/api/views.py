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
        album_list = artist.album_set.all().order_by('-release_date')
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


@api_view(['GET'])
def Search(request) :
    query = request.query_params.get('query')
    limit = request.query_params.get('limit', 5)

    try :
        limit = int(limit)
    except :
        limit = 25

    if query is None or query == '' : 
        return Response({'detail': 'invalid query.'}, status=400, content_type='application/json')

    # Searching for artists
    try :
        artist_with_exact_name = Artist.objects.get(name=query)
    except Artist.DoesNotExist :
        artist_with_exact_name = None

    if artist_with_exact_name is not None : excluded_artists_ids = [artist_with_exact_name.id]
    else: excluded_artists_ids = []
    artist_icontains = Artist.objects.filter(name__icontains=query).exclude(id__in=excluded_artists_ids)
    if artist_with_exact_name is not None : artists = Artist.objects.filter(id=artist_with_exact_name.id) | artist_icontains
    else: artists = artist_icontains
    
    # Searching for tracks
    tracks_with_exact_title = Track.objects.filter(title=query).order_by('-rank')
    excluded_tracks_ids = [track.id for track in tracks_with_exact_title]
    tracks_icontains = Track.objects.filter(title__icontains=query).exclude(id__in=excluded_tracks_ids).order_by('-rank')
    tracks = tracks_with_exact_title | tracks_icontains

    # Searching for albums
    albums_with_exact_title = Album.objects.filter(title=query)
    excluded_albums_ids = [album.id for album in albums_with_exact_title]
    albums_icontains = Album.objects.filter(title__icontains=query).exclude(id__in=excluded_albums_ids)
    albums = albums_with_exact_title | albums_icontains

    # Serializer data
    context = {
        'artist': ArtistDetailedSerializer(artist_with_exact_name).data,
        'artists': {
            'data': ArtistDetailedSerializer(artists[0:limit], many=True).data ,
            'total': artists.count(),
            'next': f'{request.scheme}://{request.get_host()}/api/music/search/artists?query={query}&limit={limit}&index={limit}' if limit <= artists.count() else None,
        },
        'tracks': {
            'data': TrackDetailedSerializer(tracks[0:limit], many=True).data,
            'total': tracks.count(),
            'next': f'{request.scheme}://{request.get_host()}/api/music/search/tracks?query={query}&limit={limit}&index={limit}' if limit <= tracks.count() else None,
        },
        'albums': {
            'data': AlbumDetailedSerializer(albums[0:limit], many=True).data,
            'total': albums.count(),
            'next': f'{request.scheme}://{request.get_host()}/api/music/search/albums?query={query}&limit={limit}&index={limit}' if limit <= albums.count() else None,
        }
    }

    return Response(context,content_type='application/json')


@api_view(['GET'])
def SearchTracks(request) :
    query = request.query_params.get('query')
    limit = request.query_params.get('limit', 25)
    index = request.query_params.get('index', 0)

    try :
        limit = int(limit)
    except :
        limit = 25

    try :
        index = int(index)
    except :
        index = 0

    if query is None or query == '' : 
        return Response({'detail': 'invalid query.'}, status=400, content_type='application/json')

    tracks_with_exact_title = Track.objects.filter(title=query).order_by('-rank')
    excluded_tracks_ids = [track.id for track in tracks_with_exact_title]
    tracks_icontains = Track.objects.filter(title__icontains=query).exclude(id__in=excluded_tracks_ids).order_by('-rank')
    tracks = tracks_with_exact_title | tracks_icontains

    next_index = index + limit
    prev_index = index - limit
    total = tracks.count()

    context = {
        'data': TrackDetailedSerializer(tracks[index: index+limit], many=True).data,
        'total': total,
        'next': f'{request.scheme}://{request.get_host()}/api/music/search/tracks?query={query}&limit={limit}&index={next_index}' if next_index <= total else None,
        'prev': f'{request.scheme}://{request.get_host()}/api/music/search/tracks?query={query}&limit={limit}&index={prev_index}' if prev_index >= 0 else None,
    }

    context = dict([(k, v) for k, v in context.items() if v is not None])

    return Response(context,content_type='application/json')


@api_view(['GET'])
def SearchArtists(request) :
    query = request.query_params.get('query')
    limit = request.query_params.get('limit', 25)
    index = request.query_params.get('index', 0)

    try :
        limit = int(limit)
    except :
        limit = 25

    try :
        index = int(index)
    except :
        index = 0

    if query is None or query == '' : 
        return Response({'detail': 'invalid query.'}, status=400, content_type='application/json')

    try :
        artist_with_exact_name = Artist.objects.get(name=query)
    except Artist.DoesNotExist :
        artist_with_exact_name = None

    if artist_with_exact_name is not None : excluded_artists_ids = [artist_with_exact_name.id]
    else: excluded_artists_ids = []
    artist_icontains = Artist.objects.filter(name__icontains=query).exclude(id__in=excluded_artists_ids)
    if artist_with_exact_name is not None : artists = Artist.objects.filter(id=artist_with_exact_name.id) | artist_icontains
    else: artists = artist_icontains

    next_index = index + limit
    prev_index = index - limit
    total = artists.count()

    context = {
        'data': ArtistDetailedSerializer(artists[index: index+limit], many=True).data,
        'total': total,
        'next': f'{request.scheme}://{request.get_host()}/api/music/search/artists?query={query}&limit={limit}&index={next_index}' if next_index <= total else None,
        'prev': f'{request.scheme}://{request.get_host()}/api/music/search/artists?query={query}&limit={limit}&index={prev_index}' if prev_index >= 0 else None,
    }

    context = dict([(k, v) for k, v in context.items() if v is not None])

    return Response(context,content_type='application/json')


@api_view(['GET'])
def SearchAlbums(request) :
    query = request.query_params.get('query')
    limit = request.query_params.get('limit', 25)
    index = request.query_params.get('index', 0)

    try :
        limit = int(limit)
    except :
        limit = 25

    try :
        index = int(index)
    except :
        index = 0

    if query is None or query == '' : 
        return Response({'detail': 'invalid query.'}, status=400, content_type='application/json')

    albums_with_exact_title = Album.objects.filter(title=query)
    excluded_albums_ids = [album.id for album in albums_with_exact_title]
    albums_icontains = Album.objects.filter(title__icontains=query).exclude(id__in=excluded_albums_ids)
    albums = albums_with_exact_title | albums_icontains

    next_index = index + limit
    prev_index = index - limit
    total = albums.count()

    context = {
        'data': AlbumDetailedSerializer(albums[index: index+limit], many=True).data,
        'total': total,
        'next': f'{request.scheme}://{request.get_host()}/api/music/search/albums?query={query}&limit={limit}&index={next_index}' if next_index <= total else None,
        'prev': f'{request.scheme}://{request.get_host()}/api/music/search/albums?query={query}&limit={limit}&index={prev_index}' if prev_index >= 0 else None,
    }

    context = dict([(k, v) for k, v in context.items() if v is not None])

    return Response(context,content_type='application/json')