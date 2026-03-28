from rest_framework import viewsets
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

class AppointmentViewSet(viewsets.ModelViewSet):

    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Appointment.objects.all()
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        else:
            return Appointment.objects.filter(patient=user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # ONLY doctor/admin can approve/reject
        if 'status' in request.data:
            if user.role not in ['admin', 'doctor']:
                raise PermissionDenied("You cannot change status")

        return super().update(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        new_status = request.data.get('status')

        # Patient can ONLY cancel their own appointment
        if new_status == "Cancelled":
            if user != instance.patient:
                raise PermissionDenied("You can only cancel your own appointment")

        # Only doctor/admin can approve/reject
        if new_status in ["Approved", "Rejected"]:
            if user.role not in ["admin", "doctor"]:
                raise PermissionDenied("Not allowed")

        return super().update(request, *args, **kwargs)