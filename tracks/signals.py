from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Artist

import requests, json

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

@receiver(post_save, sender=Artist)
def AsignAlbums(sender, instance, created, *args, **kwargs) :
    if created :
        getArtistsDetails(instance)