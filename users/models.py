from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

import string, re
from random import choice

def generateUserId() :
    allowed = string.ascii_letters + string.digits
    return ''.join([choice(allowed) for _ in range(17)])

class Account(AbstractUser):
    id = models.CharField(max_length=17, primary_key=True, default=generateUserId, editable=True)
    is_active = models.BooleanField(default=False)
    email = models.EmailField(max_length=200, unique=True, blank=False, null=False, error_messages={
        'unique': _('A user with that email already exists.')
    })

    # Profil_img
    # added playlists

    def save(self, *args, **kwargs) :
        EMAIL_REGEX = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")

        if not EMAIL_REGEX.match(self.email) :
            raise ValidationError(_('Email address is not valid'), code='invalid')

        super().save(*args, **kwargs)