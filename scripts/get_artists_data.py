import sys, re, time, json
import requests
import threading
import functools
import logging
import unicodedata

from tracks.models import Artist 
from .main import connect_to_broker

MIN_FAN = 1000 # Minimume number of funs
THREADS_COUNT = 4
logError = logging.getLogger('errors').error
logDebug = logging.getLogger('debuging').debug

# Clean artist name for search query
def normalize(name) :
    name_normalized = unicodedata.normalize('NFKD', name.strip()).encode('ascii', 'ignore').decode()

    pattern = re.compile('^(.{4,})\s\(.+\)$')
    match = pattern.match(name_normalized)

    if match :
        name_normalized = match.group(1)

    return name_normalized


def sleepWithHeartbeat(connection, time_to_sleep=3) :
    time_start = time.time()

    while time.time() - time_start < time_to_sleep :
        print('??')
        connection.process_data_events()
        time.sleep(50 / 1000)

def searchArtistData(name, connection, tries=0) :
    try :
        url = f'https://api.deezer.com/search/artist?q={name}&limit=1'
        req = requests.get(url, timeout=3)
        req.raise_for_status()
        content = req.content.decode()
        response = json.loads(content)

        # check if response has data array
        if 'data' in response and len(response.get('data', [])) >= 1 :
            artist_data = response.get('data')[0]
            
            # check if artist data has enough fans
            if artist_data.get('nb_fan', 0) > MIN_FAN :
                return artist_data
            else :
                print(f'[*] artist "{name}" not enough fans')
                return None
        
        # check if it is an deezer error
        elif 'error' in response and response.get('error').get('code') == 4 :
            sleepWithHeartbeat(connection, 5) # performe heartbeating will sleeping

            if tries < 5 : # check enough trying
                return searchArtistData(name, connection, tries + 1)
            else : # close connection if tried too much to fix problem
                logError(f'searchArtistData({name}) : connection.close() because i tried too much\n\tresponse : \n\t{response}')
                connection.close()
                return None
        else :
            print(f'Debug {response}')
            return None
        
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) : 
        sleepWithHeartbeat(connection, 5) # performe heartbeating will sleeping

        if tries < 5 : # check enough trying
            return searchArtistData(name, connection, tries + 1)
        else : # close connection if tried too much to fix problem
            logError(f'searchArtistData({name}) : connection.close() because i tried too much\n\tresponse : \n\t{response}')
            print(f'searchArtistData({name}) : connection.close() because i tried too much\n\tresponse : \n\t{response}')
            connection.close()
            return None
    except Exception as ex : # Close Connection Exception is anknown
        logError(f'searchArtistData({name}) : connection.close() because : {ex.__str__()}')
        print(f'searchArtistData({name}) : connection.close() because : {ex.__str__()}')
        connection.close()
        return None

def on_message(ch, method, properties, body, connection) :
    print('.')
    name = normalize(body.decode())
    
    try :
        Artist.objects.get(name__iexact=name)
        artists_name_exists = True
        print(f'[*] artist "{name}" already exists')
    except Artist.DoesNotExist :
        artists_name_exists = False
    
    if not artists_name_exists :
        data = searchArtistData(name, connection)
    else :
        data = None

    if data is not None :
        try :
            Artist.objects.get(deezer_id=data.get('id'))
            print(f'[*] artist with id "{data.get("id")}" already exists')
        except Artist.DoesNotExist :
            artist = Artist(deezer_id=data.get('id'), name=data.get('name'))
            artist.picture = data.get('picture')
            artist.picture_small = data.get('picture_small')
            artist.picture_medium = data.get('picture_medium')
            artist.picture_big = data.get('picture_big')
            artist.picture_xl = data.get('picture_xl')
            try :
                artist.save()
                print(f'\033[0;34m[+] Artists "{data.get("name")} has been created\033[0m"')
            except Exception as ex:
                print(f'[EXCEPTION] Could not save artist "{artist.name}".')
                logError(f'Could not save artist "{artist.name}" because : {ex.__str__()}')

    if connection.is_open and ch.is_open :
        ch.basic_ack(delivery_tag=method.delivery_tag)


def getArtistsData(connection, i) :
    channel = connection.channel()
    channel.basic_qos(prefetch_count=1)

    on_message_callback = functools.partial(on_message, connection=connection)
    channel.basic_consume(queue='artists_names', on_message_callback=on_message_callback)
    
    try :
        print(f'[{i}] Thread start consuming')
        channel.start_consuming()
        print(f'[*] Thread-{i} finished consuming')
    except Exception as ex:
        error_text = f'Thread-{i} stoped consuming because : {ex.__str__()}'
        logError(error_text)
        print(f'\033[0;31m[EXCEPTION] {error_text} \033[0m') 
        channel.stop_consuming()


def run() :
    threads = []
    connections = []
    
    # Initialize threads each one with his connection
    for i in range(0, THREADS_COUNT) :
        connection = connect_to_broker(heartbeat=600, blocked_connection_timeout=300)
        thread = threading.Thread(target=getArtistsData, args=(connection, i), daemon=True)
        threads.append(thread)
        connections.append(connection)

         
    try :
        for t in threads : t.start() # Start threads
        print('=' * 5, f'{THREADS_COUNT} Threads Has Been Started', '=' * 5)
        for t in threads : t.join() # wait for threads to finish
        print('=' * 5, f'All Threads Finished', '=' * 5)
    except KeyboardInterrupt :
        sys.exit(0)
    
