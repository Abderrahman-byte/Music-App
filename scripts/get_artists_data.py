import threading, logging, sys, requests, json, re
import unicodedata

from tracks.models import Artist
from .main import connect_broker

MIN_FAN = 1000

def normalize(name) :
    name_normalized = unicodedata.normalize('NFKD', name.strip()).encode('ascii', 'ignore').decode()

    pattern = re.compile('^(\w{4,})\s\(.+\)$')
    match = pattern.match(name_normalized)

    if match :
        name_normalized = match.group(1)

    return name_normalized

def add_artist(name) :
    url = f'https://api.deezer.com/search/artist?q={name}'
    try :
        req = requests.get(url)
        content = req.content.decode()
        response = json.loads(content)
        data = response.get('data')

        if len(data) >= 1 :
            artist_data = data[0]
        
            if artist_data.get('nb_fan') >= MIN_FAN :
                try :
                    artist = Artist(deezer_id=artist_data.get('id'), name=artist_data.get('name'))
                    artist.picture = artist_data.get('picture')
                    artist.picture_small = artist_data.get('picture_small')
                    artist.picture_medium = artist_data.get('picture_medium')
                    artist.picture_big = artist_data.get('picture_big')
                    artist.picture_xl = artist_data.get('picture_xl')
                    artist.save()
                except Exception as ex :
                    print(f'add_artist({name}) : {ex.__str__()}')
                    logging.getLogger('errors').error(f'get_artists_data from add_artist: {ex.__str__()}')
        else :                     
            print(f'{name} no data')

    except Exception as ex :
        logging.getLogger('errors').error(f'get_artists_data from add_artist: {ex.__str__()}')

def get_data(ch, method, properties, body) :
    name = normalize(body.decode())

    try :
        Artist.objects.get(name__iexact=name)
        print(f'{name} already exists')
    except Artist.DoesNotExist :
        add_artist(name.lower())

    ch.basic_ack(delivery_tag=method.delivery_tag)

def get_artists_data(n) :
    try :
        connection = connect_broker()
        channel = connection.channel()

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='artists_names', on_message_callback=get_data)
        print(f'Thread-{n} start consuming')
        channel.start_consuming()
    except Exception as ex :
        logging.getLogger('errors').error(f'get_artists_data : Thread-{n} {ex.__str__()}')

def start_workers(workers_num=4) :
    threads = []

    for n in range(0, workers_num) :
        thread = threading.Thread(target=get_artists_data, args=(n,))
        threads.append(thread)

    for thread in threads : thread.start()
    print('Thread has been started')
    for thread in threads : thread.join()

def run() :
    start_workers()
