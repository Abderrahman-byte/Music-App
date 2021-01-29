import threading, requests, logging, json, sys

from tracks.models import Track, Album
from .main import connect_broker

LIMIT = 1000

errorsLogger = logging.getLogger('errors')
debugLogger = logging.getLogger('debuging')

def add_track(data, album) :
    try :
        Track.objects.get(deezer_id=data.get('id'))
        print(f'\tTrack "{data.get("title")}" already exists')
    except Track.DoesNotExist :
        track = Track(title=data.get('title'), deezer_id=data.get('id'), album=album)
        track.preview = data.get('preview')
        track.rank = data.get('rank')
        track.save()
        print(f'\tTrack "{data.get("title")}" has been created')

def get_album_data(album_id, tries=0) :
    try :
        url = f'https://api.deezer.com/album/{album_id}/tracks?limit={LIMIT}'
        req = requests.get(url, timeout=3)
        
        if req.status_code == requests.codes.get('ok') :
            content = req.content.decode()
            data = json.loads(content).get('data', [])

            return data
        else :
            debugLogger.debug(f'add_track : {url} responded with {req.status_code} error')
            return []
    except (requests.exception.ConnectionError, requests.exception.Timeout) :
        time.sleep(3)

        if tries < 3 :
            return get_album_data(album_id, tries + 1)
        else :
            errorsLogger.error(f'get_album_data({album_id}) : enough trying')
            return []
    except Exception as ex :
        errorsLogger.error(f'get_album_data({album_id}) : {ex.__str__()}')
        return []
    
def get_tracks(ch, method, properties, body) :
    try :
        album_id = int(body)
        data = get_album_data(album_id)

        if len(data) > 0:
            print(f'[*] album {album_id} found {len(data)} track')
            album = Album.objects.get(deezer_id=album_id)
            for track_data in data :
                add_track(track_data, album)
        else :
            debugLogger.debug(f'add_track : {album_id} is an empty album')

    except Exception as ex :
        errorsLogger.error(f'add_tracks({body.decode()}) : {ex.__str__()}')
    
    ch.basic_ack(delivery_tag=method.delivery_tag)
        
def get_albums_tracks(n) :
    try :
        connection = connect_broker()
        channel = connection.channel()
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='album_tracks', on_message_callback=get_tracks)
        print(f'[*] Thread-{n} start consuming')
        channel.start_consuming()
    except Exception as ex :
        errorsLogger.error(f'Thread-{n} : {ex.__str__()}')

def start_workers(workers_num = 4) :
    threads = []

    for n in range(0, workers_num) :
        thread = threading.Thread(target=get_albums_tracks, args=(n,))
        thread.daemon = True
        threads.append(thread)

    try :
        for t in threads : t.start()
        for t in threads : t.join()
    except KeyboardInterrupt :
        sys.exit(1)
    except Exception as ex :
        errorsLogger.error('get_albums_tracks : {ex.__str__()}')

def run() :
    start_workers(6)
