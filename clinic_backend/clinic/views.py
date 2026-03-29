from django.utils import timezone
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

        # AUTO UPDATE COMPLETED
        Appointment.objects.filter(
            status="Approved",
            date_time__lt=timezone.now()
        ).update(status="Completed")

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

        new_status = request.data.get('status')

        # 👤 PATIENT RULES
        if user.role == "patient":
            # Can only edit/cancel if Pending
            if instance.status != "Pending":
                raise PermissionDenied("You can only modify pending appointments")

            # If trying to cancel
            if new_status == "Cancelled":
                return super().update(request, *args, **kwargs)

            # If editing fields (condition, date, etc.)
            return super().update(request, *args, **kwargs)

        # 👨‍⚕️ DOCTOR / ADMIN RULES (your existing logic)
        if new_status:
            if user.role not in ["admin", "doctor"]:
                raise PermissionDenied("Not allowed")

        if new_status == "Approved" and instance.status != "Pending":
            raise PermissionDenied("Only pending appointments can be approved")

        if new_status == "Rejected" and instance.status != "Pending":
            raise PermissionDenied("Only pending appointments can be rejected")

        if new_status == "Cancelled" and instance.status != "Approved":
            raise PermissionDenied("Only approved appointments can be cancelled")

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # 👨‍💼 ADMIN → delete all
        if user.role == "admin":
            return super().destroy(request, *args, **kwargs)

        # 👨‍⚕️ DOCTOR → only inactive
        if user.role == "doctor":
            if instance.status not in ["Completed", "Cancelled", "Rejected"]:
                raise PermissionDenied("Doctors can only delete inactive appointments")
            return super().destroy(request, *args, **kwargs)

        # 👤 PATIENT → only own + inactive
        if user.role == "patient":
            if instance.patient != user:
                raise PermissionDenied("Not your appointment")

            if instance.status not in ["Completed", "Cancelled", "Rejected"]:
                raise PermissionDenied("You can only delete finished appointments")

            return super().destroy(request, *args, **kwargs)

        raise PermissionDenied("Not allowed")