import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

import os, re, string, time
import json

FORBIDDEN = ['top', '0-9'] + string.ascii_lowercase.split() + string.digits.split()
NOT_TO_START_WITH = ['list of', 'categorie:', 'sitar', 'category:']

def verifyStart(item) :
    for text in NOT_TO_START_WITH :
        if item.lower().startswith(text.lower()) or item.lower() in FORBIDDEN:
            return False
    return True

def getLinksList() :
    results = list()
    req = requests.get('https://en.wikipedia.org/wiki/Lists_of_musicians')
    html = req.content.decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    navlinks = soup.select('#toc[aria-label="Contents"] ul li a')
    section_ids = [re.sub('^(#)(.+)$', '\\2', link.get('href')) for link in navlinks]

    for id in section_ids :
        id_sublinks = soup.find(id=id).parent.findNext('div').select('ul li > a')
        results+= [urljoin('https://en.wikipedia.org', link.get('href')) for link in id_sublinks]

    return results

def getArtistsFromPage(link: str) :
    req = requests.get(link)
    html = req.content.decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')

    artists_list = [an.text for an in soup.select('#mw-content-text > .mw-parser-output ul > li > a')]
    artists_list = list(filter(verifyStart, artists_list))

    print(f'{link} finished') # DEBUG
    return artists_list

def getArtistsLists(links) : 
    artists = list()

    for i, link in enumerate(links) :
        print(f'start crawling {link} {i}/{len(links)}') # DEBUG
        artists+= getArtistsFromPage(link)

    artists = list(dict.fromkeys(artists))
    open('crawling.json', 'w').write(json.dumps(artists, indent=4)) # DEBUG
    print(artists) # DEBUG
    
    return artists

def run(*args) :
    start_time = time.time()
    # Get list of music genres pages from : "https://en.wikipedia.org/wiki/Lists_of_musicians"
    pagesList = getLinksList()
    # Get list af Artist from each page
    artistsList = getArtistsLists(pagesList)
    
    print('get artists finished on', time.time() - start_time)