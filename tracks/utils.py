import string
from random import choice

def generate_id(length=20) :
    allowed = string.digits + string.ascii_letters
    return ''.join([choice(allowed) for _ in range(length)])