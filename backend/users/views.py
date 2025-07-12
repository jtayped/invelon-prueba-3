import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from .models import User, Preference
from .serializers import UserSerializer
from .validators import validate_preferences

TEST_URL = "https://invelonjobinterview.herokuapp.com/api/post_test"


class UserListCreate(APIView):

    def get(self, request):
        users = User.objects.prefetch_related("preferences").all()
        data = UserSerializer(users, many=True).data
        return Response(data)

    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        prefs = [int(n) for n in request.data.get("preferences")]
        affiliate = request.data.get("affiliate") in ["true", True]

        # validate inputs
        try:
            validate_preferences(prefs)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # call test server
        payload = {
            "name": name,
            "email": email,
            "preferences": prefs,
            "affiliate": str(affiliate).lower(),
        }
        try:
            resp = requests.post(TEST_URL, json=payload, timeout=5)
            resp.raise_for_status()
        except requests.RequestException as e:
            return Response(
                {"error": "Test server error"}, status=status.HTTP_502_BAD_GATEWAY
            )

        # create user in our DB
        try:
            user = User.objects.create(name=name, email=email, affiliate=affiliate)
        except IntegrityError:
            return Response(
                {"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        # map test-server preferences (assume it returns names)
        data = resp.json()
        for key in data.get("preferences", []):
            Preference.objects.create(user=user, key=key)

        return Response(data, status=status.HTTP_201_CREATED)
