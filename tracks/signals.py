from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Artist

@receiver(post_save, Artist)
def AsignAlbums(sender, instance, created) :
    if created :
        print(f'{instance.id} {instance.name} justed created so you better asign albums')