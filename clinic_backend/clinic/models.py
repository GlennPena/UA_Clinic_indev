from django.utils import timezone
from django.db import models
from users.models import User

class Appointment(models.Model):
    """Model representing an appointment between a patient and a doctor."""

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')

    year_section = models.CharField(max_length=100)
    condition = models.TextField()
    date_time = models.DateTimeField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    last_status = models.CharField(max_length=20, default='Pending')

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto complete if past and approved
        if self.status == "Approved" and self.date_time < timezone.now():
            self.status = "Completed"

        if self.pk:
            old = Appointment.objects.get(pk=self.pk)
            if old.status != self.status:
                self.last_status = old.status

        super().save(*args, **kwargs)