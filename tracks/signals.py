from django.db.models.signals import post_save
from django.dispatch import receiver

import requests, json, time
from datetime import datetime

from .models import Artist, Album, Genre, Track

def getAlbums(instance, nb) :
    url = f'https://api.deezer.com/artist/{instance.deezer_id}/albums?limit={nb}'
    req = requests.get(url)
    content = json.loads(req.content.decode('utf-8'))

    if content.get('data') is None or  type(content.get('data')) != list or len(content.get('data')) <= 0 or content.get('total') == 0 :
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

        time.sleep(0.5)

def getAlbumDetails(instance) :
    url = f'https://api.deezer.com/album/{instance.deezer_id}'
    req = requests.get(url)
    content = json.loads(req.content.decode('utf-8'))

    genres = content.get('genres', {}).get('data')
    tracks = content.get('tracks', {}).get('data')

    instance.cover_big = content.get('cover_big', instance.cover_big)
    instance.cover_medium = content.get('cover_medium', instance.cover_medium)
    instance.cover_small = content.get('cover_small', instance.cover_small)
    instance.cover_xl = content.get('cover_xl', instance.cover_xl)

    if genres is not None and type(genres) == list and len(genres) >= 0:
        for genre in genres :
            # Get Or Create genre
            if type(genre) != dict or genre.get('name') is None or genre.get('id') is None  :
                continue
            g, created = Genre.objects.get_or_create(deezer_id=genre.get('id'), name=genre.get('name'), picture=genre.get('picture'))
            instance.genres.add(g)

    instance.save()

    if tracks is not None and type(tracks) == list and len(tracks) >= 0:
        for track in tracks :
            # Create Track
            if type(track) != dict or track.get('title') is None or track.get('id') is None  :
                return
                
            try :
                t = Track(
                    deezer_id=track.get('id'), 
                    album=instance, 
                    preview=track.get('preview'), 
                    title=track.get('title'),
                    rank=track.get('rank')
                )
                t.save()
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
    getAlbums(instance, nb_album)

@receiver(post_save, sender=Artist)
def artistCreated(sender, instance, created, *args, **kwargs) :
    if created :
        getArtistsDetails(instance)

@receiver(post_save, sender=Album)
def albumCreated(sender, instance, created, *args, **kwargs) :
    if created :
        getAlbumDetails(instance)