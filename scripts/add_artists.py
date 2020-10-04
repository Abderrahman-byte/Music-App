import requests
from urllib.parse import quote

import json, os, time

def log(content: dict) :
    logging = list()
    if os.path.exists('logs.json') :
        logging = json.loads(open('logs.json', 'r').read())
    logging.append(content)
    open('logs.json', 'w').write(json.dumps(logging, indent=4))

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

def run() :
    start_time = time.time()
    artists_list = getArtistsList()
    
    for i, art in enumerate(artists_list):
        print(f'searching for {art} {i}/{len(artists_list)} ; {round(time.time() - start_time, 2)} passed')
        searchForArtist(art)

    print('add artists ended on', time.time() - start_time)