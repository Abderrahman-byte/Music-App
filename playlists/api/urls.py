from django.urls import path

from . import views

urlpatterns = [
    path('', views.UserPlaylists.as_view(), name='user-playlists'),
    path('list/<str:id>', views.PlaylistDetails.as_view(), name='playlist-details'),
]