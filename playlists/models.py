from django.db import models

from users.models import generateUserId, Account
from tracks.models import Track

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