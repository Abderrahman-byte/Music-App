import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

import os, re
import json

def getLinksList() :
    results = []
    req = requests.get('https://en.wikipedia.org/wiki/Lists_of_musicians')
    html = req.content.decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    navlinks = soup.select('#toc[aria-label="Contents"] ul li a')
    section_ids = [re.sub('^(#)(.+)$', '\\2', link.get('href')) for link in navlinks]

    for id in section_ids :
        id_sublinks = soup.find(id=id).parent.findNext('div').select('ul li > a')
        results+= [urljoin('https://en.wikipedia.org', link.get('href')) for link in id_sublinks]
    
    results = list(filter(lambda link: urlparse(link).netloc == 'en.wikipedia.org', results))
    return results
    
def run(*args) :
    # Get list of music genres pages from : "https://en.wikipedia.org/wiki/Lists_of_musicians"
    pagesList = getLinksList()
    # Get list af Artist from each page
    # Search each artist or band in Deeze Api on : "https://api.deezer.com/search/artist?q={artist-name}"
    # Create Artist object model 
    print('get artists finished')