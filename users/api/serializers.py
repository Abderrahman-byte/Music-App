from rest_framework import serializers
from django.db import utils
from django.core.exceptions import ValidationError

import re, logging

from ..models import Account

class AccountSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Account
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
    
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

            return AccountSerializer(account)
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