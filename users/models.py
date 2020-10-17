from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

import string
from random import choice

def generateUserId() :
    allowed = string.ascii_letters + string.digits
    return ''.join([choice(allowed) for _ in range(17)])

class Account(AbstractUser):
    id = models.CharField(max_length=17, primary_key=True, default=generateUserId, editable=True)
    is_active = models.BooleanField(default=False)
    email = models.CharField(max_length=200, unique=True, null=False, error_messages={
        'unique': _('A user with that email already exists.')
    })

    # Profil_img
    # added playlists