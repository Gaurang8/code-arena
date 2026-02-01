from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework.views import exception_handler

def success_response(data=None, message="Success", status=http_status.HTTP_200_OK):
    return Response({
        "success": True,
        "message": message,
        "data": data
    }, status=status)

def error_response(message="Error", errors=None, status=http_status.HTTP_400_BAD_REQUEST):
    payload = {
        "success": False,
        "message": message
    }
    if errors:
        payload["errors"] = errors
    return Response(payload, status=status)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "success": False,
            "message": "Request failed",
            "errors": response.data
        }

    return response
