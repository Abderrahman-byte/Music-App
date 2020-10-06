import requests, queue
from urllib.parse import quote
from threading import Thread, Lock

from tracks.models import Artist

import json, os, time, logging

COUNT_OF_THREADS = 4
global_lock = Lock()

def getArtistsList() :
    if not os.path.exists('artists.json') : 
        logging.getLogger('errors').error('artists.json file doesnt exist.')
        return []
    return json.loads(open('artists.json').read())

def log(content: dict) :
    while global_lock.locked() :
        continue
    
    global_lock.acquire()
    logging = list()

    if os.path.exists('logs.json') :
        try :
            logging = json.loads(open('logs.json', 'r').read())
        except Exception as ex:
            logging.getLogger('errors').error('Cannot read log.json file because ' + ex.__str__())
            logging = list()

    logging.append(content)
    
    fp = open('logs.json', 'w')
    fp.write(json.dumps(logging, indent=4))
    fp.close()
    global_lock.release()

def createArticleModel(data: dict) :
    if data.get('name') is None or data.get('id') is None :
        return

    try :
        artist = Artist.objects.get(deezer_id=data.get('id'))
        logging.getLogger('warnings').warning(f'artist "{data.get("name")}" with id {artist.deezer_id} already exist')
    except Artist.DoesNotExist :
        artist = Artist(name=data.get('name'), deezer_id=data.get('id'))

    try :
        artist.save()
    except Exception as ex:
        logging.getLogger('errors').error(f'Cannot save artist "{artist.name}" because : ' + ex.__str__())

def getMostPopular(response: dict) :
    if response.get('data') is None or type(response.get('data')) != list or response.get('total') is None or response.get('total') <= 0 :
        if response.get('error') :
            logging.getLogger('errors').error('Error recieved from deerer', response.get('error'))
        return None

    most_fan = list(sorted(response.get('data'), key=lambda item: item.get('nb_fan'), reverse=True))[0]
    return most_fan

def searchForArtist(keyword) :
    url = f'https://api.deezer.com/search/artist?q={quote(keyword)}&limit=100000000000'
    try :
        req = requests.get(url)
    except Exception as ex :
        logging.getLogger('errors').error(f'Couldnt search for Artist "{keyword}" because : ' + ex.__str__())
        return
    content = json.loads(req.content.decode('utf-8'))
    artist_data = getMostPopular(content)
    if artist_data is not None :
        createArticleModel(artist_data)
        # log(artist_data)
    else :
        logging.getLogger('warnings').warning(f'"{keyword}" was not match in deezer search')

def StarProcessing(articles: list) :
    start_process = time.time()
    print('start processing shit')
    threads = []
    articles_queue = queue.Queue()
    articles_queue.queue = queue.deque(articles)

    def start_worker() :
        print('start working')
        while not articles_queue.empty() :
            art = articles_queue.get()
            searchForArtist(art)
            index = len(articles) - articles_queue.qsize()
            print(f'Artist fetched "{art}"; processed {index} in {time.time() - start_process} ; {round((index) / len(articles) * 100, 2)}% done')
            logging.getLogger('debuging').debug(f'Artist "{art}" created with his albums and tracks')
            time.sleep(1)

    for _ in range(COUNT_OF_THREADS) :
        t = Thread(target=start_worker)
        threads.append(t)
        t.start()

    [thread.join() for thread in threads]

def run() :
    start_time = time.time()
    artists_list = getArtistsList()
    
    # for i, art in enumerate(artists_list):
    #     print(f'searching for {art} {i}/{len(artists_list)} ; {round(time.time() - start_time, 2)} passed')
    #     searchForArtist(art)

    StarProcessing(artists_list)

    logging.getLogger('debuging').debug(f'add artists ended in {round(time.time() - start_time, 2)}s')
    print(f'add artists ended in {round(time.time() - start_time, 2)}s')
