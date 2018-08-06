from django.db import models
from common.models import TimeStamped, Activatable
from django.contrib.auth.models import User


class Link(TimeStamped, Activatable):
    url = models.URLField('URL')
    description = models.TextField('Description', null=True, blank=True)
    posted_by = models.ForeignKey(User, null=True)

    def __str__(self):
        return 'id - {}, url - {}, posted by - {}'.format(
            self.id,
            self.url,
            self.posted_by.username
        )
