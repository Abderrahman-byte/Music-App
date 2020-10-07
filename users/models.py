from django.db import models
from django.contrib.auth.models import AbstractUser

import string
from random import choice

def generateUserId() :
    allowed = string.ascii_letters + string.digits
    return ''.join([choice(allowed) for _ in range(17)])

class Account(AbstractUser):
    id = models.CharField(max_length=17, primary_key=True, default=generateUserId, editable=True)

    # Add user email to be unique
    # Profil_img