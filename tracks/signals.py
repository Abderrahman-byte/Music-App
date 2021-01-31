from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

import requests, json, time
from datetime import datetime
import logging, pika
import threading

from .models import Artist, Album, Genre, Track

def rabbitmq_connection() :
    conf = settings.RABBITMQ
    credentials = pika.PlainCredentials(conf.get('user'), conf.get('password'))
    parameters = pika.ConnectionParameters(conf.get('host'), conf.get('port'), conf.get('vhost'), credentials)
    connection = pika.BlockingConnection(parameters)
    
    return connection

def publish_to_queue(queue, body, connection=None, channel=None) :
    if connection is None or channel is None :
        connection = rabbitmq_connection()
        channel = connection.channel()
        channel.confirm_delivery()

    try :
        channel.basic_publish(exchange='', routing_key=queue, body=body, properties=pika.BasicProperties(delivery_mode=1))
    except :
        start_time = time.time()
        while time.time() - start_time < 3 :
            connection.process_data_events()
            time.sleep(50/1000)
        publish_to_queue(queue, body, connection, channel)


@receiver(post_save, sender=Album)
def AlbumCreated(sender, instance, created, *args, **kwargs) :
    if created :
        logging.getLogger('debuging').debug(f'Album created "{instance.title}" with id "{instance.deezer_id}"')
        try :
            publish_to_queue('album_tracks', str(instance.deezer_id))
            logging.getLogger('debuging').debug(f'Album {instance.deezer_id} added to queue "album_tracks"')
        except Exception as ex :
            logging.getLogger('errors').error(f'Could not pulish to "album_tracks" : {ex.__str__()}')

        try :
            publish_to_queue('album_genres', str(instance.deezer_id))
            logging.getLogger('debuging').debug(f'Album {instance.deezer_id} added to queue "album_genres"')
        except Exception as ex :
            logging.getLogger('errors').error(f'Could not pulish to "album_genres" : {ex.__str__()}')


@receiver(post_save, sender=Artist)
def ArtistCreated(sender, instance, created, *args, **kwargs) :
    if created :
        try :
            logging.getLogger('debuging').debug(f'Artist created "{instance.name}" with id {instance.deezer_id}')
            publish_to_queue('artist_albums', str(instance.deezer_id))
            logging.getLogger('debuging').debug(f'Artist {instance.deezer_id} added to queue "artist_albums"')
        except Exception as ex :
            logging.getLogger('errors').error(f'Could not pulish to "artist_albums" : {ex.__str__()}')
