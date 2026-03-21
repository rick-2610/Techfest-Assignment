from .models import *
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectSubmission
        fields = '__all__'