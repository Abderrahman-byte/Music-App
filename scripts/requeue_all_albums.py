import time, sys

from tracks.models import Album
from .main import connect_to_broker
from .get_artist_albums import sleepWithHeartbeats
from .requeue_all_artists import publish
 
def run() :
    try :
        time_start = time.time()
        albums_ids = [str(album.deezer_id) for album in Album.objects.all()]
        print(f'[*] fetched {len(albums_ids)} artist in {round(time.time() - time_start, 2)} s')
    
        connection = connect_to_broker()
        channel = connection.channel()
        print('[*] Connection with rabbitmq opened')
        channel.confirm_delivery()

        for count, album in enumerate(albums_ids):
            if count % 5000 == 0 :
                print(f'[*] delivered {count} in {round(time.time() - time_start, 2)} s')
                sleepWithHeartbeats(connection, 300)
            elif count % 500 == 0 :
                print(f'[*] delivered {count} in {round(time.time() - time_start, 2)} s')
                sleepWithHeartbeats(connection, 30)
            elif count % 50 == 0 :
                print(f'[*] delivered {count} in {round(time.time() - time_start, 2)} s')
                sleepWithHeartbeats(connection, 3)

            publish(connection, channel, 'album_tracks', album)
            publish(connection, channel, 'album_genres', album)
        print('[*] Requeueing done {len(albums_ids)} in {round(time.time() - time_start, 2)} s')

    except KeyboardInterrupt :
        connection.close()
        sys.exit(0)
