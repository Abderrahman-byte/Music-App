from django.db.models.signals import post_save
from django.dispatch import receiver

from .tokens import activate_accounts_token
from .models import Account

def sendActivationEmail(instance) :
    print(f'you must send a activation message to {instance.pk} user.')

@receiver(post_save, sender=Account)
def NewAccountCreated(sender, instance, created, *args, **kwargs) :
    if created and not instance.is_active :
        sendActivationEmail(instance)