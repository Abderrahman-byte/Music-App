from tracks.models import Artist

def run():
    [artist.delete() for artist in Artist.objects.all()]