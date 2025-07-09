from rest_framework import serializers
from .models import User, Preference


class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = ["key"]


class UserSerializer(serializers.ModelSerializer):
    preferences = PreferenceSerializer(many=True)

    class Meta:
        model = User
        fields = ["name", "email", "preferences", "affiliate"]
