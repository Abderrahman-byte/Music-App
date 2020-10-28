from django.urls import path

from . import views

urlpatterns = [
    path('tracks/top', views.TopTracks, name='top-tracks'),
    path('track/<str:id>', views.TrackApiView, name='track-details'),
    path('album/<str:id>', views.AlbumApiView, name='album-details'),
    path('artist/<str:id>', views.ArtistApiView, name='artist-details'),
    path('artist/<str:id>/top', views.ArtistTopTracks, name='artist-top-tracks'),
    path('artist/<str:id>/albums', views.ArtistAlbumApiView, name='artist-albums'),
    path('search', views.Search, name='search'),
    path('search/tracks', views.SearchTracks, name='search-tracks'),
    path('search/artists', views.SearchArtists, name='search-artists'),
    path('search/albums', views.SearchAlbums, name='search-albums'),
]