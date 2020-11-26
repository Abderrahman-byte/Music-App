from django.urls import path

from . import views

urlpatterns = [
    path('login', views.LoginView, name='login'),
    path('register', views.RegisterView, name='register'),
    path('logout', views.LogoutView, name='logout'),
    path('activate/<uidb64>/<token>', views.ActivateAccount, name='activate-account'),
    path('account', views.AccountDetails.as_view(), name='account-details'),
]