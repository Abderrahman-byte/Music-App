from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Artist

@receiver(post_save, sender=Artist)
def AsignAlbums(sender, instance, created, *args, **kwargs) :
    if created :
        print(f'{instance.id} {instance.name} justed created so you better asign albums')