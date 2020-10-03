from django.db import models
from django.utils import timezone

class Genre(models.Model) :
    id = models.CharField(max_length=5, primary_key=True, editable=False)
    deezer_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=200, unique=True)
    picture = models.TextField(null=True, blank=True)

class Artist(models.Model) :
    id = models.CharField(max_length=17, primary_key=True, editable=False)
    deezer_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=200, unique=True)
    picture = models.TextField(null=True, blank=True)
    picture_small = models.TextField(null=True, blank=True)
    picture_medium = models.TextField(null=True, blank=True)
    picture_big = models.TextField(null=True, blank=True)
    picture_xl = models.TextField(null=True, blank=True)

class Album(models.Model) :
    id = models.CharField(max_length=17, primary_key=True, editable=False)
    deezer_id = models.IntegerField(unique=True)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    genres = models.ManyToManyField(Genre)
    release_date  = models.DateField(default=timezone.now, editable=True)
    cover_big = models.TextField(null=True, blank=True)
    cover_medium = models.TextField(null=True, blank=True)
    cover_small = models.TextField(null=True, blank=True)
    cover_xl = models.TextField(null=True, blank=True)

class Track(models.Model) :
    id = models.CharField(max_length=17, primary_key=True, editable=False)
    deezer_id = models.IntegerField(unique=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    release_date  = models.DateField(default=timezone.now, editable=True)
    preview = models.TextField(null=True, blank=True)
    rank = models.IntegerField(unique=True)