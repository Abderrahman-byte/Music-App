import time, sys

from tracks.models import Artist
from .main import connect_to_broker
from .get_artist_albums import sleepWithHeartbeats


def publish(connection, ch, queue, body) :
    try :
        ch.basic_publish(exchange='', routing_key=queue, body=body)
    except pika.exceptions.UnroutableError :
        sleepWithHeartbeats(connection, 5)
        publish(connection, ch, queue, body)
        

def run() :
    try :
        time_start = time.time()
        artists_ids = [str(artist.deezer_id) for artist in Artist.objects.all()]
        print(f'[*] fetched {len(artists_ids)} artist in {round(time.time() - time_start, 2)} s')
    
        connection = connect_to_broker()
        channel = connection.channel()
        print('[*] Connection with rabbitmq opened')
        channel.confirm_delivery()

        for count, artist in enumerate(artists_ids):
            if count % 50 == 0 :
                print(f'[*] delivered {count} in {round(time.time() - time_start, 2)} s')
                sleepWithHeartbeats(connection, 3)

            publish(connection, channel, 'artist_albums', artist)
        print('[*] Requeueing done {len(artists_ids)} in {round(time.time() - time_start, 2)} s')

    except KeyboardInterrupt :
        connection.close()
        sys.exit(0)
