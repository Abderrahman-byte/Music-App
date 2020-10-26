from django.urls import path, include

from . import views

favorite_lists_urlpatterns = [
    path('tracks', views.FavoriteTracksAPI.as_view(), name='favorite-tracks'),
    path('artists', views.FavoriteArtistsAPI.as_view(), name='favorite-artists'),
    path('albums', views.FavoriteAlbumsAPI.as_view(), name='favorite-albums'),
    path('playlists', views.FavoritePlaylistsAPI.as_view(), name='favorite-playlists'),
]

urlpatterns = [
    path('', views.UserPlaylists.as_view(), name='user-playlists'),
    path('list/<str:id>', views.PlaylistDetails.as_view(), name='playlist-details'),
    path('subscription/<str:id>', views.Subscription.as_view(), name='subscription'),
    path('favorite/', include(favorite_lists_urlpatterns))
]