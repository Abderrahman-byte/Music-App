from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse

from .tokens import activate_accounts_token
from .models import Account

def sendActivationEmail(instance) :
    uidb64 = urlsafe_base64_encode(force_bytes(instance.id))
    token = activate_accounts_token.make_token(instance)
    path = reverse('activate-account', args=(uidb64, token))
    print(f'you must send a activation message to {instance.pk} user. url is {path}')

@receiver(post_save, sender=Account)
def NewAccountCreated(sender, instance, created, *args, **kwargs) :
    if created and not instance.is_active :
        sendActivationEmail(instance)