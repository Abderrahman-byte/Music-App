from django.conf import settings

import sys
import pika

queues = ['music_pages', 'artists_names', 'artist_albums', 'album_tracks']

def checkConf(conf) :
    if conf.get('user') is None or conf.get('password') is None :
        print('Credentials not Provided')
        sys.exit(1)

    if conf.get('host') is None :
        print('Host Should be provided')
        sys.exit(1)

    if conf.get('port') is None :
        print('Port Should be provided')
        sys.exit(1)

    if conf.get('vhost') is None :
        print('Vhost not provided')
        sys.exit(1)

def connect() :
    conf = settings.RABBITMQ
    checkConf(conf)
    
    credentials = pika.PlainCredentials(conf.get('user'), conf.get('password'))
    parameters = pika.ConnectionParameters(conf.get('host'), conf.get('port'), conf.get('vhost'), credentials)
    connection = pika.BlockingConnection(parameters)

    return connection

def run () :
    connection = connect()
    channel = connection.channel()

    for queue in queues :
        channel.queue_declare(queue=queue, durable=True)
        print(f'Queue "{queue}" has been created')

    connection.close()
