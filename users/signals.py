from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from django.core.mail import send_mail
from django.template.loader import render_to_string

import logging

from .tokens import activate_accounts_token
from .models import Account

def sendActivationEmail(instance) :
    uidb64 = urlsafe_base64_encode(force_bytes(instance.id))
    token = activate_accounts_token.make_token(instance)
    path = reverse('activate-account', args=(uidb64, token))

    try :
        message = render_to_string('users/activate_mail.html', {'path': path, 'user': instance})
        send_mail(
            subject = 'Activation of your account on Music App', 
            message = message,
            from_email='support@musicapp.ma' , 
            recipient_list = [instance.email], 
            fail_silently = False
        )
    except Exception as ex :
        logging.getLogger('errors').error(f'Exception from sendActivationEmail : {ex.__str__()}')

@receiver(post_save, sender=Account)
def NewAccountCreated(sender, instance, created, *args, **kwargs) :
    if created and not instance.is_active :
        sendActivationEmail(instance)