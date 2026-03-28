from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from users.serializers import CustomTokenSerializer
from users.views import register

class CustomTokenView(TokenObtainPairView):
    """Custom view for obtaining JWT tokens with a custom serializer."""
    serializer_class = CustomTokenSerializer

urlpatterns = [
    path('admin/', admin.site.urls),                # Admin site URL
    path('api/login/', CustomTokenView.as_view()),  # Custom login URL for JWT token retrieval
    path('api/register/', register),                # User registration URL
    path('api/', include('clinic.urls')),           # Include URLs from the clinic app
]

