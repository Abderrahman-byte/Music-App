from urllib.parse import urljoin
from bs4 import BeautifulSoup
import threading, requests, logging, re, sys, time

from .main import connect_broker

LINKS_PREFIX = 'https://en.wikipedia.org'
names_fields = ['name', 'band', 'artist', 'violinist', 'music director', 'person']
FORBIDDEN_NAMES = ['^.*category.*$', '^.*bands.*$', '^lists?\sof\s.+$', '^\w$']

def get_name_field(fields) :
    pattern = re.compile('^.+\s(name|band)$')

    for i, field in enumerate(fields) :
        if field.lower() in names_fields :
            return i
        elif re.compile('^.+\s(name|band)$').match(field.lower()) :
            return i
        elif re.compile('^name\sof\s.*$').match(field.lower()) :
            return i

    return None

def parse_names_lists(soup, channel) :
    names = []
    anchors = soup.select('#mw-content-text ul > li > a[title]')
    active = True

    for an in anchors :
        name = an.get_text()

        if active :
            for pattern in FORBIDDEN_NAMES :
                if re.compile(pattern).match(name.lower()):
                    active = False
                    break
            if active : names.append(name)

        if re.compile('^lists?\sof\s.+$').match(name.lower()):
            url = an.get('href')
            if url is not None and url != '' :
                url = urljoin(LINKS_PREFIX, url)
                channel.basic_publish(exchange='', routing_key='music_pages', body=url)

    return names
            

def parse_names_tables(soup, channel) :
    names = []
    tables = soup.select('#mw-content-text .wikitable')
    table_fields = [th.get_text().strip() for th in tables[0].find('tr').select('th')]
    name_field_index = get_name_field(table_fields)

    if name_field_index is None and len(tables[0].find_all('tr')) > 1 :
        table_fields = [th.get_text().strip() for th in tables[0].find_all('tr')[1].select('th')]
        name_field_index = get_name_field(table_fields)
    elif name_field_index is None and len(tables) == 1 :
        names = parse_names_lists(soup, channel)
        return names
    
    if name_field_index is not None :
        rows_start = 1
    else :
        name_field_index = 0
        rows_start = 0

    for table in tables :
        rows = table.find_all('tr') 
        
        for row in rows[rows_start:] :
            children = row.find_all(recursive=False)
            if len(children) > name_field_index :
                anchor = children[name_field_index].find('a')
                if anchor is not None : names.append(anchor.get_text())

    return names

def handle_message(ch, method, properties, body):
    link = body.decode()
    req = requests.get(link)
    
    if req.status_code != requests.codes.ok : 
        logging.getLogger('errors').error(f'request : {req.status_code} {link}')
        return

    soup = BeautifulSoup(req.content.decode(), 'html.parser')
    
    tables = soup.select('#mw-content-text .wikitable')
    has_table = len(tables) > 0
    
    if has_table :
        names = parse_names_tables(soup, ch)
    else :
        names = parse_names_lists(soup, ch)

    for name in names :
        ch.basic_publish(exchange='', routing_key='artists_names', body=name.strip())

    ch.basic_ack(delivery_tag=method.delivery_tag)
    log_message = f'proccessing {link} done'
    print(log_message)
    logging.getLogger('debug').debug(log_message)

def get_artists_names(n) : 
    try :
        connection = connect_broker()
        channel = connection.channel()
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='music_pages', on_message_callback=handle_message)
        print(f'Thread-{n} start consuming')
        channel.start_consuming()
    except Exception as ex :
        logging.getLogger('errors').error(f'get_artists_names thread-{n} : {ex.__str__()}')

def start_workers(workers=4) :
    threads = []
    stop_event = threading.Event()

    for n in range(0, workers) :
        thread = threading.Thread(target=get_artists_names, args=(n,))
        threads.append(thread)

    try :
        for t in threads : t.start()
        for t in threads : t.join()
    except (KeyboardInterrupt, SystemExit) :
        sys.exit(0)

def run() :
    start_workers(4)
