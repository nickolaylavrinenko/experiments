import functools
from graphene_django.views import HttpError
from django.http.response import HttpResponseForbidden


def auth_required(func, *args, **kwargs):
	@functools.wraps(func)
	def wrapper(self, info, *args, **kwargs):
		if (info is not None and
				not info.context.user.is_authenticated):
			raise HttpError(HttpResponseForbidden('User auth required'))
		return func(self, info, *args, **kwargs)
	return wrapper
