from rest_framework import serializers
from .models import Appointment
from django.utils import timezone
from .utils import encrypt, decrypt

class AppointmentSerializer(serializers.ModelSerializer):

    condition = serializers.CharField()
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'
        extra_kwargs = {
            'patient': {'read_only': True},
        }

    # ✅ MUST EXIST (this is your error fix)
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    # ✅ MUST EXIST
    def get_doctor_name(self, obj):
        return f"{obj.doctor.first_name} {obj.doctor.last_name}"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['condition'] = decrypt(instance.condition)
        return data

    def validate(self, data):
        if data['date_time'] < timezone.now():
            raise serializers.ValidationError("No past date allowed")

        queryset = Appointment.objects.filter(
            doctor=data['doctor'],
            date_time=data['date_time']
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("Duplicate schedule")

        return data

    def create(self, validated_data):
        validated_data['condition'] = encrypt(validated_data['condition'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'condition' in validated_data:
            validated_data['condition'] = encrypt(validated_data['condition'])
        return super().update(instance, validated_data)