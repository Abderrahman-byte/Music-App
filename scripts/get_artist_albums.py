import sys, time, json
import logging
import requests
import threading
import functools
import datetime

from tracks.models import Album, Artist
from.main import connect_to_broker

LIMIT = 1000
THREADS = 6

logError = logging.getLogger('errors').error
logDebug = logging.getLogger('debuging').debug

def validate_date(date_str) :
    try :
        datetime.datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except :
        return False

def sleepWithHeartbeats(connection, time_to_sleep:int) :
    start_time = time.time()

    while time.time() - start_time < time_to_sleep :
        print('???????????????????????')
        connection.process_data_events()
        time.sleep(50 / 1000)

def submit_album(data, artist) :
    try :
        Album.objects.get(deezer_id=data.get('id'))
    except Album.DoesNotExist :
        album = Album(title=data.get('title'), artist=artist, deezer_id=data.get('id'))
        album.cover_big = data.get('cover_big')
        album.cover_medium = data.get('cover_medium')
        album.cover_small = data.get('cover_small')
        album.cover_xl = data.get('cover_xl')

        if validate_date(data.get('release_date')) :
            album.release_date = data.get('release_date')

        album.save()
        print(f'\talbum "{album.title}" has been created')


def getAlbums(artist_id, connection, tries=0) :
    try :
        url = f'https://api.deezer.com/artist/{artist_id}/albums?limit={LIMIT}'
        req = requests.get(url, timeout=3)
        req.raise_for_status()
        content = req.content.decode()
        response = json.loads(content)

        if 'data' in response and len(response.get('data', [])) > 0 :
            return response.get('data', [])
        elif 'error' in response and response.get('error').get('code') == 4 :
            sleepWithHeartbeats(connection, 5)

            if tries < 3 :
                return getAlbums(artist_id, connection, tries + 1)
            else :
                print(f'getAlbums({artist_id}) : connection has to be closed because of trying too much')
                logError(f'getAlbums({artist_id}) : connection has to be closed because of trying too much')
                connection.close()
                return []
        else :
            return []

    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) : 
        sleepWithHeartbeats(connection, 5)

        if tries < 3 :
            return getAlbums(artist_id, connection, tries + 1)
        else :
            print(f'getAlbums({artist_id}) : connection has to be closed because of trying too much')
            logError(f'getAlbums({artist_id}) : connection has to be closed because of trying too much')
            connection.close()
            return []

    except Exception as ex :
        connection.close()
        print(f'\033[0;31m[EXCEPTION] Connection has to be stoped : {ex.__str__()}\033[0m')
        logError(f'Connection has to be stoped : {ex.__str__()}')
        return []


def on_message(ch, method, properties, body, connection) :
    artist_id = body.decode()
    albums_data = getAlbums(artist_id, connection)

    try :
        artist = Artist.objects.get(deezer_id=artist_id)
    except Artist.DoesNotExist :
        connection.close()
        logError(f'Artist with id "{artist_id}" does not exists')
        return
    
    print(f'[+] Artist "{artist_id}" has {len(albums_data)} of albums')
    for album in albums_data :
        connection.process_data_events()
        try :
            submit_album(album, artist)
        except Exception as ex:
            print(f'[EXCEPTION] submit_album({album.get("id")}) : {ex.__str__()}')
            logError(f'submit_album({album.get("id")}) : {ex.__str__()}')
    
    if connection.is_open and ch.is_open :
        ch.basic_ack(delivery_tag=method.delivery_tag)

def get_artist_albums(n) :
    connection = connect_to_broker(heartbeat=600, blocked_connection_timeout=300)
    channel = connection.channel()
    
    on_message_callback = functools.partial(on_message, connection=connection)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='artist_albums', on_message_callback=on_message_callback)

    try :
        print(f'Thread-{n} start consuming')
        channel.start_consuming()
        print(f'Thread-{n} finished consuming')
    except Exception as ex :
        error_text = f'Thread-{n} get_artist_album stops consuming because : {ex.__str__()}'
        print(f'\033[0;31m[EXCEPTION] {error_text}\033[0m')
        logError(error_text)

def run() :
    threads = []

    for i in range(0, THREADS) :
        thread = threading.Thread(target=get_artist_albums, args=(i,), daemon=True)
        threads.append(thread)

    try :
        for t in threads : t.start()
        print('=' * 5, f'{THREADS} Threads Has Been Started', '=' * 5)
        for t in threads : t.join()
        print('=' * 5, f'All Threads Has Finished', '=' * 5)
    except KeyboardInterrupt :
        sys.exit()
