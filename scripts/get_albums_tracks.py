import json, sys, time
import threading
import requests
import logging
import functools
import datetime

from tracks.models import Track, Album
from .main import connect_to_broker

LIMIT = 1000
THREADS = 6

logError = logging.getLogger('errors').error
logDebug = logging.getLogger('debuging').debug

def sleepWithHeartbeat(connection, time_to_sleep=3) :
    start_time = time.time()

    while time.time() - start_time < time_to_sleep :
        print('?' * 50)
        connection.process_data_events()
        time.sleep(50/1000)

def add_track(data, album) :
    try :
        Track.objects.get(deezer_id=data.get('id'))
        print(f'\tTrack "{data.get("title")}" already exists')
    except Track.DoesNotExist :
        track = Track(title=data.get('title'), deezer_id=data.get('id'), album=album)
        track.preview = data.get('preview')
        track.rank = data.get('rank')
        track.release_date = album.release_date
        track.save()
        print(f'\tTrack "{data.get("title")}" has been created')

def get_album_data(album_id, connection, tries=0) :
    try :
        url = f'https://api.deezer.com/album/{album_id}/tracks?limit={LIMIT}'
        req = requests.get(url, timeout=3)
        req.raise_for_status() 
        content = req.content.decode()
        response = json.loads(content)

        if 'data' in response and len(response.get('data')) > 0 :
            return response.get('data')
        elif 'error' in response and response.get('error').get('code') == 4 :
            sleepWithHeartbeat(connection, 3)

            if tries < 3 :
                return get_album_data(album_id, connection, tries + 1)
            else :
                print(f'get_album_data({album_id}) : enough trying')
                logError(f'get_album_data({album_id}) : enough trying')
                connection.close()
                return []
        else :
            return []
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) :
        sleepWithHeartbeat(connection, 3)

        if tries < 3 :
            return get_album_data(album_id, connection, tries + 1)
        else :
            print(f'get_album_data({album_id}) : enough trying')
            logError(f'get_album_data({album_id}) : enough trying')
            connection.close()
            return []
    except Exception as ex :
        logError(f'get_album_data({album_id}) : {ex.__str__()}')
        return []

def on_message(ch, method, properties, body, connection) :
    album_id = body.decode()
    data = get_album_data(album_id, connection) 
    album = Album.objects.get(deezer_id=album_id)
    
    print(f'[+] Album "{album_id}" has "{len(data)}" track')
    for track_data in data :
        connection.process_data_events()
        try :
            add_track(track_data, album)
        except Exception as ex :
            print(f'add_track({track_data.id}) : {ex.__str__()}')
            logError(f'add_track({track_data.id}) : {ex.__str__()}')
            connection.close()

    if connection.is_open and ch.is_open :
        ch.basic_ack(delivery_tag=method.delivery_tag)

def get_albums_tracks(n) :
    connection = connect_to_broker()
    channel = connection.channel()
    channel.basic_qos(prefetch_count=1)

    on_message_callback = functools.partial(on_message, connection=connection) 
    channel.basic_consume(queue='album_tracks', on_message_callback=on_message_callback)

    try :
        print(f'Thread-{n} start consuming')
        channel.start_consuming()
    except Exception as ex :
        print(f'Thread-{n} stops consuming : {ex.__str__()}')
        logError(f'Thread-{n} stops consuming : {ex.__str__()}')
        channel.stop_consuming()

def run() :
    threads = []

    for i in range(0, THREADS) :
        thread = threading.Thread(target=get_albums_tracks, args=(i,), daemon=True)
        threads.append(thread)

    try :
        for t in threads : t.start()
        print('=' * 5, f'{THREADS} Threads Has Been Started', '=' * 5)
        for t in threads : t.join()
        print('=' * 5, 'All Threads Has Been Finished', '=' * 5)
    except KeyboardInterrupt :
        sys.exit(0)
