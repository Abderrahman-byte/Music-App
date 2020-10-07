from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Track, Album, Artist, Genre
from .serializers import TrackSimpleSerializer

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
    serializer = TrackSimpleSerializer(top_tracks, many=True)
    response_data = {
        'data': serializer.data, 
        'next': f'/api/music/tracks?limit={25}&index={index + limit}',
        'prev': f'/api/music/tracks?limit={25}&index={index - limit}'
    }
    return Response(response_data, content_type='application/json')