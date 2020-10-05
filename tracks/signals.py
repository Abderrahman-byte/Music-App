from django.db.models.signals import post_save
from django.dispatch import receiver

import requests, json
from datetime import datetime

from .models import Artist, Album

def getAlbums(instance, nb) :
    url = f'https://api.deezer.com/artist/{instance.deezer_id}'
    req = requests.get(url)
    content = json.loads(req.content.decode('utf-8'))

    if content.get('data') is None or  type(content.get('data')) != list or len(content.get('data') <= 0) or content.get('total') == 0 :
        return

    for album in content.get('data') :
        title = album.get('title')
        deezer_id = album.get('id')
        release = album.get('release_date')

        if release is not None : release = datetime.strptime(release, '%Y-%m-%d')

        try :
            album = Album.objects.get(deezer_id=deezer_id)
            print(f'album {title} with id {deezer_id} already exists')
        except Album.DoesNotExist :
            album = Album(deezer_id=deezer_id, title=title, release_date=release, artist=instance)

        try :
            album.save()
        except Exception as ex :
            print(ex) 

def getArtistsDetails(instance) :
    url = f'https://api.deezer.com/artist/{instance.deezer_id}'

    req = requests.get(url)
    content = json.loads(req.content.decode('utf-8'))
    
    instance.picture = content.get('picture', instance.picture)
    instance.picture_small = content.get('picture_small', instance.picture_small)
    instance.picture_medium = content.get('picture_medium', instance.picture_medium)
    instance.picture_big = content.get('picture_big', instance.picture_big)
    instance.picture_xl = content.get('picture_xl', instance.picture_xl)
    instance.save()

    nb_album = content.get('nb_album')
    getAlbums(instance, nb)

@receiver(post_save, sender=Artist)
def artistCreated(sender, instance, created, *args, **kwargs) :
    if created :
        getArtistsDetails(instance)

def albumCreated(sender, instance, created, *args, **kwargs) :
    if created :
        print(f'Album {instance.title} was created with id {instance.id}')