from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('me/', views.MeView.as_view(), name='me'),
    path('update-role/<int:user_id>/', views.UserRoleUpdateView.as_view(), name='update-role'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Admin Panel URLs
    path('admin/users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:user_id>/', views.AdminUserDetailUpdateView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:user_id>/delete/', views.AdminUserDeleteView.as_view(), name='admin-user-delete'),
    path('admin/users/<int:user_id>/restore/', views.AdminUserRestoreView.as_view(), name='admin-user-restore'),
]