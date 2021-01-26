from urllib.parse import urljoin
from bs4 import BeautifulSoup
import requests, time

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

    channel.basic_publish(exchange='', routing_key='music_pages', body='')
    connection.close()

def run() :
    get_music_pages()
    pass
