from urllib.parse import urljoin
from bs4 import BeautifulSoup
import requests, time, logging

from .main import connect_broker

MAIN_PAGE = 'https://en.wikipedia.org/wiki/Lists_of_musicians'
LINKS_PREFIX = 'https://en.wikipedia.org'

def get_music_pages() :
    connection = connect_broker()
    channel = connection.channel()

    req = requests.get(MAIN_PAGE)
    content = req.content.decode('utf-8')
    soup = BeautifulSoup(content, 'html.parser')

    list_of_pages = soup.select('#mw-content-text ul > li > a[title^="List of"]')
    
    for page in list_of_pages :
        link = urljoin(LINKS_PREFIX, page.get('href'))
        channel.basic_publish(exchange='', routing_key='music_pages', body=link)
        time.sleep(0.1)

    connection.close()
    logging.getLogger('debuging').debug(f'Added to queue {len(list_of_pages)} music page link')

def run() :
    try :
        get_music_pages()
    except Exception as ex :
        logging.getLogger('errors').error(f'get_music_pages : {ex.__str__()}')
