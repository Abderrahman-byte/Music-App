from django.db import models

from users.models import generateUserId, Account
from tracks.models import Track, Artist

class TracksPlaylist(models.Model) :
    id = models.CharField(max_length=17, primary_key=True, default=generateUserId, editable=False)
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Account, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    tracks = models.ManyToManyField(Track)

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta :
        constraints = [
            models.UniqueConstraint(fields=['author', 'title'], name='unique-title-playlist-for-creator'),
        ]

class Follow(models.Model) :
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta :
        constraints = [
            models.UniqueConstraint(fields=['user', 'artist'], name='user_follow_artist_only_once'),
        ]