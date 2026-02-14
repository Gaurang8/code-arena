from rest_framework import serializers
from .models import Language

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'judge0_language_id', 'is_active', 'slug']
        read_only_fields = ['id', 'slug']
        extra_kwargs = {
            'name': {'error_messages': {'unique': 'Language already exists'}},
            'judge0_language_id': {'error_messages': {'unique': 'Language already exists'}},
        }