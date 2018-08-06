from django.db import models
from django.utils import timezone


class TimeStamped(models.Model):
    """
        Provides created and updated timestamps on models.
    """

    created = models.DateTimeField(null=True, editable=False)
    updated = models.DateTimeField(null=True, editable=False)

    def save(self, dont_update_timestamps=False, *args, **kwargs):
        if not dont_update_timestamps:
            _now = timezone.now()
            self.updated = _now
            if not self.pk:
                self.created = _now

        super(TimeStamped, self).save(*args, **kwargs)

    class Meta:
        abstract = True


class Activatable(models.Model):
    """
    Provide is_active attribute.
    """

    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True
