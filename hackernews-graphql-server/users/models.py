from django.db import models
from django.contrib.auth.models import User as BaseUser
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import AbstractUser

# import binascii
# import os


__all__ = ('User',)


class User(BaseUser):
	pass
#     token = models.CharField(max_length=40)

#     def save(self, *args, **kwargs):
#         if not self.token:
#             self.token = binascii.hexlify(os.urandom(20)).decode()
#         return super().save(*args, **kwargs)

#     def __str__(self):
#         return 'id - {}, username - {}, email - {}'.format(
#             self.id,
#             self.username,
#             self.email
#         )
