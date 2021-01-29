import threading, requests, logging, json, sys, time

from tracks.models import Album, Genre
from .main import connect_broker


errorsLogger = logging.getLogger('errors')
debugLogger = logging.getLogger('debuging')


def get_album_genres(album_id, tries=0) :
    print('.')
    try :
        url = f'https://api.deezer.com/album/{album_id}'
        req = requests.get(url, timeout=3)
        req.raise_for_status()
        
        if req.status_code == requests.codes.get('ok') :
            content = req.content.decode()
            data = json.loads(content)

            if 'error' in data and data.get('error').get('code') == 4 :
                time.sleep(3)
                if tries < 3 :
                    return get_album_genres(album_id, tries + 1)
                else :
                    return []
            else :
                return data.get('genres', {}).get('data', []) 
        else :
            debugLogger.debug(f'get_album_genre : {url} responded with {req.status_code} error')
            return []

    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) :
        time.sleep(3)
        
        if tries < 3 :
            print(f'retry get_album_genres({album_id})')
            return get_album_genres(album_id, tries + 1)
        else :
            print(f'get_album_genres({album_id}) : enough trying')
            errorsLogger.error(f'get_album_genres({album_id}) : enough trying')
            return []

    except Exception as ex :
        errorsLogger.error(f'update_album({album_id}) : {ex.__str__()}')
        return []

def update_album(ch, method, properties, body) :
    try :
        album_id = int(body)
        data = get_album_genres(album_id)
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
