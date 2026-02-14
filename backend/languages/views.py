from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Language
from .serializers import LanguageSerializer
from core.utils.response import success_response, error_response

class LanguageView(APIView):

    def get_queryset(self, request, all_languages):
        if request.user.role == 'admin' or all_languages:
            return Language.objects.all()
        return Language.objects.filter(is_active=True)

    def get(self, request):
        # all_languages=true ( params ) & admin then send all else filterd
        all_languages = request.query_params.get('all_languages', '').lower() == 'true'

        queryset = self.get_queryset(request, all_languages)
        serializer = LanguageSerializer(queryset, many=True)
        return success_response(serializer.data, message='Languages fetched successfully', status=200)

    def post(self, request):
        serializer = LanguageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, message='Language created successfully', status=201)
        return error_response(message='Failed to create language', errors=serializer.errors, status=400)


class LanguageDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Language, pk=pk)

    def put(self, request, pk):
        language = self.get_object(pk)
        serializer = LanguageSerializer(language, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, message='Language updated successfully', status=200)
        return error_response(message='Failed to update language', errors=serializer.errors, status=400)

    def patch(self, request, pk):
        language = self.get_object(pk)
        serializer = LanguageSerializer(language, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, message='Language updated successfully', status=200)
        return error_response(message='Failed to update language', errors=serializer.errors, status=400)

    def delete(self, request, pk):
        language = self.get_object(pk)
        language.delete()
        return success_response([], message='Language deleted permanently', status=200)
