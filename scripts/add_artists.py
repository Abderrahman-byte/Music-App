import requests, queue
from urllib.parse import quote
from threading import Thread, Lock

import json, os, time

COUNT_OF_THREADS = 5
global_lock = Lock()

def log(content: dict) :
    while global_lock.locked() :
        continue
    
    global_lock.acquire()
    logging = list()

    if os.path.exists('logs.json') :
        try :
            logging = json.loads(open('logs.json', 'r').read())
        except :
            logging = list()

    logging.append(content)
    
    fp = open('logs.json', 'w')
    fp.write(json.dumps(logging, indent=4))
    fp.close()
    global_lock.release()

def getMostPopular(response: dict) :
    if response.get('data') is None or type(response.get('data')) != list or response.get('total') is None or response.get('total') <= 0 :
        if response.get('error') :
            print(response.get('error'))
        return None

    most_fan = list(sorted(response.get('data'), key=lambda item: item.get('nb_fan'), reverse=True))[0]
    return most_fan

def getArtistsList() :
    if not os.path.exists('crawling.json') : return []
    return json.loads(open('crawling.json').read())

def searchForArtist(keyword) :
    url = f'https://api.deezer.com/search/artist?q={quote(keyword)}&limit=100000000000'
    req = requests.get(url)
    content = json.loads(req.content.decode('utf-8'))
    artist_data = getMostPopular(content)
    if artist_data is not None :
        log(artist_data) 
    else :
        print(keyword, 'was no match')

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

    print('add artists ended on', time.time() - start_time)