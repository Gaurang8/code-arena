from django.urls import path
from . import views

urlpatterns = [
    path('csrf/' , views.CSRFTokenView.as_view(), name='csrf-token'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('register/', views.RegisterView.as_view(), name='register'),
    # path('admin-only/', views.AdminOnlyView.as_view(), name='admin-only'),
    path('me/', views.MeView.as_view(), name='me'),
]