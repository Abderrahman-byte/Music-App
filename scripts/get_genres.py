from tracks.models import Genre

import logging, requests, json

URL = 'https://api.deezer.com/genre'

errorsLogger = logging.getLogger('errors')
debugLogger = logging.getLogger('debuging')

def add_genre (data):
    try :
        genre = Genre.objects.get(deezer_id=data.get('id', 1000000))
        print(f'Genre with id {data.get("id")} already exists')
    except Genre.DoesNotExist :
        genre = Genre(name=data.get('name'), picture=data.get('picture_xl'), deezer_id=data.get('id'))
        genre.save()
        debugLogger.debug(f'Genre "{data.get("name")}" has been created')

def run() :
    try :
        req = requests.get(URL, headers={'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'})
        if req.status_code == requests.codes.get('ok') :
            content = req.content.decode()
            data = json.loads(content).get('data', [])

            if len(data) > 0 :
                print(f'Found {len(data)} genres')
                for genre_data in data :
                    add_genre(genre_data)
            else :
                print('No data found')
        else :
            print(f'Requests to "{URL}" returns {req.status_code}')
    except Exception as ex :
        errorsLogger.error(f'get genres : {ex.__str__()}')
