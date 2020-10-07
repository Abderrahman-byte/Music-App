from django.urls import path

from . import views

urlpatterns = [
    path('tracks/top', views.TopTracks, name='get-top-tracks')
]