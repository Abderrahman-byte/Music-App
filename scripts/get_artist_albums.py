import threading, sys, logging, requests, json, time

from tracks.models import Album, Artist
from.main import connect_broker

LIMIT = 1000

def submit_album(data, artist) :
    try :
        Album.objects.get(deezer_id=data.get('id'))
    except Album.DoesNotExist :
        album = Album(title=data.get('title'), artist=artist, release_date=data.get('release_date'), deezer_id=data.get('id'))
        album.cover_big = data.get('cover_big')
        album.cover_medium = data.get('cover_medium')
        album.cover_small = data.get('cover_small')
        album.cover_xl = data.get('cover_xl')
        album.save()
        print(f'\talbum "{album.title}" has been created')

def get_albums_data(artist_id, tries=0) :
    try :
        url = f'https://api.deezer.com/artist/{artist_id}/albums?limit={LIMIT}'
        req = requests.get(url, timeout=3)
        req.raise_for_status()

        if req.status_code == requests.codes.get('ok') :
            content = req.content.decode()
            response_data = json.loads(content)
            data = response_data.get('data', [])
            return data
        else :
            return []
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) :
        time.sleep(3)

        if tries < 3 :
            return get_albums_data(artist_id, tries + 1)
        else :
            logging.getLogger('errors').error(f'get_albums_data({artist_id}) : enought trying') 
            return []

    except Exception as ex :
        logging.getLogger('errors').error(f'get_albums_data({artist_id}) : {ex.__str__()}') 
        return []


def add_albums(ch, method, properties, body) :
    try :
        deezer_id = int(body)
        data = get_albums_data(deezer_id)

        if len(data) > 0 :
            print(f'[*] adding {len(data)} albums for {deezer_id}')
            artist = Artist.objects.get(deezer_id=deezer_id)

            for album_data in data :
                submit_album(album_data, artist)
        else :    
            logging.getLogger('debuging').debug(f'add_albums({body}) : empty data') 
    except Exception as ex :
        logging.getLogger('errors').error(f'add_albums({body}) : {ex.__str__()}') 
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

def get_artist_albums(n):
    try :
        connection = connect_broker()
        channel = connection.channel()
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='artist_albums', on_message_callback=add_albums)
        print(f'Thread-{n} start consuming')
        channel.start_consuming()
    except Exception as ex:
        logging.getLogger('errors').error(f'get_artist_albums : Thread-{n} : {ex.__str__()}')

def start_workers(workers_num) :
    threads = []

    for n in range(0, workers_num) :
        thread = threading.Thread(target=get_artist_albums, args=(n,))
        thread.daemon = True
        threads.append(thread)

    try :
        for t in threads : t.start()
        for t in threads : t.join()
    except KeyboardInterrupt :
        sys.exit(0)

def run() :
    start_workers(5)
