import threading, requests, logging, json, sys

from tracks.models import Album, Genre
from .main import connect_broker


errorsLogger = logging.getLogger('errors')
debugLogger = logging.getLogger('debuging')


def update_album(ch, method, properties, body) :
    try :
        album_id = int(body)
        url = f'https://api.deezer.com/album/{album_id}'
        req = requests.get(url)
        
        if req.status_code == requests.codes.get('ok') :
            content = req.content.decode()
            data = json.loads(content)
            album = Album.objects.get(deezer_id=album_id)
    
            for genre_data in data.get('genres', {}).get('data', []) :
                try :
                    genre = Genre.objects.get(deezer_id=genre_data.get('id'))
                except Genre.DoesNotExist:
                    genre = Genre(deezer_id=genre_data.get('id'), name=genre_data.get('name'), picture=genre_data.get('picture'))
                    genre.save()
                    debugLogger.debug(f'New Genre created "{genre.name}"')

                if genre not in album.genres.all() :
                    album.genres.add(genre)
                    album.save()

            print(f'procession "{album.title}" done')
        else :
            debugLogger.debug(f'update_album : {url} responded with {req.status_code} error')

        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as ex :
        errorsLogger.error(f'update_album({body.decode()}) : {ex.__str__()}')
        
def get_albums_genres(n) :
    try :
        connection = connect_broker()
        channel = connection.channel()
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='album_genres', on_message_callback=update_album)
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
