import threading, sys, logging, requests, json

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
    
def add_albums(ch, method, properties, body) :
    try :
        deezer_id = int(body)
        print(f'getting albums of {body}')
        url = f'https://api.deezer.com/artist/{deezer_id}/albums?limit={LIMIT}'
        req = requests.get(url)

        if req.status_code == requests.codes.get('ok') :
            content = req.content.decode()
            response_data = json.loads(content)
            data = response_data.get('data')
            artist = Artist.objects.get(deezer_id=deezer_id)

            if len(data) > 0 :
                for album_data in data :
                    submit_album(album_data, artist)
            else :    
                logging.getLogger('debuging').debug(f'add_album({body}) : empty data') 
        else :
            logging.getLogger('errors').error(f'add_album({body}) : response status {req.status_code}') 
        
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as ex :
        logging.getLogger('errors').error(f'add_album({body}) : {ex.__str__()}') 

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
