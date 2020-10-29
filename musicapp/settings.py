"""
Django settings for musicapp project.

Generated by 'django-admin startproject' using Django 3.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import os

import json, logging

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '8#1o24x#s@r2gcg+m_o#46gea8%cv@d=wpgvo((u4e9@ewyk8f'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_extensions',
    'corsheaders',

    'tracks.apps.TracksConfig',
    'users.apps.UsersConfig',
    'playlists.apps.PlaylistsConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'musicapp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'musicapp.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'music_app',
        'HOST': 'localhost',
        'PORT': '5432',
        'USER': 'music_app_admin',
        'PASSWORD': 'Abdou@25002001',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'

# Loggers

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{levelname}] [{asctime}] [{process:d}] {message}',
            'style': '{'
        }
    },

    'handlers': {
        'errors_handler': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'errors.log'),
            'formatter': 'verbose',
            'maxBytes': 1024*1024*1
        },
        'warnings_handler': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
            'formatter': 'verbose',
            'maxBytes': 1024*1024*1
        },
        'debuging_handler': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
            'formatter': 'verbose',
            'maxBytes': 1024*1024*1
        }
    },

    'loggers': {
        'errors': {
            'handlers': ['errors_handler'],
            'level': 'ERROR',
            'propagate': False
        },
        'warnings': {
            'handlers': ['warnings_handler'],
            'level': 'WARNING',
            'propagate': False
        },
        'debuging': {
            'handlers': ['debuging_handler'],
            'level': 'DEBUG',
            'propagate': True
        }
    }
} 


# Authentication costumization

AUTH_USER_MODEL = 'users.Account'
AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.AllowAllUsersModelBackend']

# Url Conf
ROOT_HOSTCONF = 'localhost:8000'
SITE_PROTO = 'http'

# Email SMTP Configuration
try :
    mail_cred = json.loads(open('./mail.json', 'r').read())
except Exception as ex :
    logging.getLogger('errors').error(f'Error comming from SMTP settings : {ex.__str__()}.')
    mail_cred = dict()
    
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = '587'
EMAIL_HOST_USER = mail_cred.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = mail_cred.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

# CORS Headers Config

CORS_ALLOW_CREDENTIALS = True

if DEBUG :
    CORS_ORIGIN_ALLOW_ALL = True