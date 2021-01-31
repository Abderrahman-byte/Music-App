import json, sys, time
import threading
import requests
import logging
import functools

from tracks.models import Album, Genre
from .main import connect_to_broker


errorsLogger = logging.getLogger('errors')
debugLogger = logging.getLogger('debuging')

def sleepWithHeartbeat(connection, time_to_sleep=3) :
    start_time = time.time()
    
    while time.time() - start_time < time_to_sleep :
        connection.process_data_events()
        time.sleep(50/1000)

def get_album_genres(album_id, connection, tries=0) :
    print('.')
    try :
        url = f'https://api.deezer.com/album/{album_id}'
        req = requests.get(url, timeout=3)
        req.raise_for_status()
        content = req.content.decode()
        response = json.loads(content)

        if 'genres' in response and len(response.get('genres', {}).get('data', [])) > 0 :
            return response.get('genres').get('data')
        elif 'error' in response and response.get('error').get('code') == 4 :
            sleepWithHeartbeat(connection, 5)
            if tries < 3 :
                return get_album_genres(album_id, connection, tries + 1)
            else :
                connection.close()
                print(f'Connection had to be closed : enough trying')
                errorsLogger.error(f'Connection had to be closed : enough trying')
                return []
        else :
            return []

    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) :
        sleepWithHeartbeat(connection, 5)
        if tries < 3 :
            return get_album_genres(album_id, connection, tries + 1)
        else :
            connection.close()
            print(f'Connection had to be closed : enough trying')
            errorsLogger.error(f'Connection had to be closed : enough trying')
            return []
    except Exception as ex :
        connection.close()
        errorsLogger.error(f'update_album({album_id}) connection has to be closed : {ex.__str__()}')
        return []

def update_album(ch, method, properties, body, connection) :
    try :
        album_id = int(body)
        data = get_album_genres(album_id, connection)
        album = Album.objects.get(deezer_id=album_id)

        for genre_data in data :
            try :
                genre = Genre.objects.get(deezer_id=genre_data.get('id'))
            except Genre.DoesNotExist:
                genre = Genre(deezer_id=genre_data.get('id'), name=genre_data.get('name'), picture=genre_data.get('picture'))
                genre.save()
                print(f'New Genre created "{genre.name}"')
                debugLogger.debug(f'New Genre created "{genre.name}"')

            if genre not in album.genres.all() :
                album.genres.add(genre)
                album.save()

        print(f'[*] "{album.title}" has {len(data)} genre')

    except Exception as ex :
        errorsLogger.error(f'update_album({body.decode()}) : {ex.__str__()}')

    ch.basic_ack(delivery_tag=method.delivery_tag)
        
def get_albums_genres(n) :
    try :
        connection = connect_to_broker()
        channel = connection.channel()
        channel.basic_qos(prefetch_count=1)
        on_message_callback = functools.partial(update_album, connection=connection)
        channel.basic_consume(queue='album_genres', on_message_callback=on_message_callback)
        print(f'[*] Thread-{n} start consuming')
        channel.start_consuming()
    except Exception as ex :
        errorsLogger.error(f'Thread-{n} : {ex.__str__()}')

def start_workers(workers_num = 4) :
    threads = []

    for n in range(0, workers_num) :
        thread = threading.Thread(target=get_albums_genres, args=(n,))
        thread.daemon = True
        threads.append(thread)

    try :
        for t in threads : t.start()
        for t in threads : t.join()
    except KeyboardInterrupt :
        sys.exit(1)
    except Exception as ex :
        errorsLogger.error('update_albums_genres : {ex.__str__()}')

def run() :
    start_workers(6)
