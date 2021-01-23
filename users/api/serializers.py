from rest_framework import serializers
from django.db import utils
from django.core.exceptions import ValidationError
from django.conf import settings

from urllib.parse import urljoin

import os, re, logging

from ..models import Account

class MediaUrl(serializers.Field) :
    def to_representation(self, value) :
        filePath = os.path.join(settings.MEDIA_URL, value.lstrip('/'))
        url = urljoin(f'{settings.SITE_PROTO}://{settings.ROOT_HOSTCONF}/', filePath)
        return url

class AccountSerializer(serializers.ModelSerializer) :
    avatar = MediaUrl()

    class Meta :
        model = Account
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'avatar']
    
    def create(self, **validated_data) :
        username = validated_data.get('username')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        email = validated_data.get('email')
        password = validated_data.get('password')

        if username is None : raise Exception('username field is required')
        if first_name is None : raise Exception('first name field is required')
        if last_name is None : raise Exception('last name field is required')
        if email is None : raise Exception('email field is required')

        try :
            account = Account(username=username, first_name=first_name, last_name=last_name, email=email)
            account.set_password(password)
            account.save()

            return account
        except utils.IntegrityError as ex :
            regex = re.compile('\((.+)\)\=\(.+\)')
            field_name = regex.search(ex.__str__()).group(1)
            error_msg = account.unique_error_message(Account, (field_name, )).message
            raise Exception(error_msg)
        except ValidationError as ex :
            raise Exception(', '.join(ex.messages))
        except Exception as ex :
            logging.getLogger('errors').error(f'Exception in "AccountSerializer.create" : {ex.__str__()}')
            raise Exception('Something goes wrong')

    def update(self, instance, **validated_data) :
        try :
            instance.username = validated_data.get('username', instance.username)
            instance.first_name = validated_data.get('first_name', instance.first_name)
            instance.last_name = validated_data.get('last_name', instance.last_name)
            instance.email = validated_data.get('email', instance.email)
            instance.save()
            return instance
        except utils.IntegrityError as ex :
            regex = re.compile('\((.+)\)\=\(.+\)')
            field_name = regex.search(ex.__str__()).group(1)
            error_msg = instance.unique_error_message(Account, (field_name, )).message
            raise Exception(error_msg)
        except ValidationError as ex :
            raise Exception(', '.join(ex.messages))
        except Exception as ex :
            logging.getLogger('errors').error(f'Exception in "AccountSerializer.create" : {ex.__str__()}')
            raise Exception('Something goes wrong')