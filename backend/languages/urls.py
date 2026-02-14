from django.urls import path
from .views import LanguageView, LanguageDetailView

urlpatterns = [
    path('', LanguageView.as_view(), name='language-list'),
    path('<int:pk>/', LanguageDetailView.as_view(), name='language-detail'),
]