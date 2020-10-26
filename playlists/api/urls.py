from django.urls import path

from . import views

urlpatterns = [
    path('', views.UserPlaylists.as_view(), name='user-playlists'),
    path('list/<str:id>', views.PlaylistDetails.as_view(), name='playlist-details'),
    path('subscription/<str:id>', views.Subscription.as_view(), name='subscription'),
    path('favorite/tracks', views.FavoriteTracksAPI.as_view(), name='favorite-tracks'),
    path('favorite/artists', views.FavoriteArtistsAPI.as_view(), name='favorite-artists'),
    path('favorite/albums', views.FavoriteAlbumsAPI.as_view(), name='favorite-albums'),
    path('favorite/playlists', views.FavoritePlaylistsAPI.as_view(), name='favorite-playlists'),
]