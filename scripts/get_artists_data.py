import threading, logging, sys, requests, json

from tracks.models import Artist
from .main import connect_broker

MIN_FAN = 1000

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
                artist = Artist(deezer_id=artist_data.get('id'), name=artist_data.get('name'))
                artist.save()
                logging.getLogger('debuging').debug(f'artist {artist_data.get("name")} with id {artist_data.get("id")} has been added')

    except Exception as ex :
        logging.getLogger('errors').error(f'get_artists_data from add_artist: {ex.__str__()}')

def get_data(ch, method, properties, body) :
    try :
        Artist.objects.get(name=body)
    except Artist.DoesNotExist :
        add_artist(body)

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
