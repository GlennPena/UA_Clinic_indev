from rest_framework.decorators import api_view
from rest_framework.response import Response
# from django.contrib.auth.hashers import make_password
from .models import User
from .serializers import UserSerializer
from rest_framework import viewsets
from rest_framework import status

# @api_view(['POST']) # Endpoint for user registration
# def register(request):
#     """Registers a new user."""
#     data = request.data
#     user = User.objects.create(
#         username=data['username'],
#         password=make_password(data['password']),
#         role=data.get('role', 'patient')
#     )
#     return Response({"message": "User created"})

@api_view(['POST'])
def register(request):
    """Registers a new user with all required fields."""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for listing doctors."""
    queryset = User.objects.filter(role="doctor")
    serializer_class = UserSerializer