from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet
from users.views import DoctorViewSet

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet)
router.register(r'doctors', DoctorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]