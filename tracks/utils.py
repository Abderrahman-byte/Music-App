import string
from random import choice

def generate_id_func(length=15) :
    def generate_id() :
        allowed_chars = string.ascii_letters + string.digits
        return ''.join([choice(allowed_chars) for _ in range(length)])
    return generate_id