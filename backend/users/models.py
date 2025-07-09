from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    affiliate = models.BooleanField()


class Preference(models.Model):
    user = models.ForeignKey(User, related_name="preferences", on_delete=models.CASCADE)
    key = models.CharField(max_length=50)  # e.g. 'water', 'coffee'
