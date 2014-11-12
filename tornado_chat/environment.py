
from datetime import timedelta
import redis as _redis
from config import config
from redis.exceptions import ConnectionError as RedisConnectionError
from utils import AttrDict


__all__ = ['environment']


class AppConfigurationError(Exception):
    pass

# REDIS INIT

redis_host = config.get('redis', 'redis_host')
if not redis_host:
    raise AppConfigurationError('Redis host is not specified in config file')
redis = _redis.Redis(redis_host)
try:
    redis.get('test')
except RedisConnectionError:
    raise AppConfigurationError('Redis storage "%r" is not available' % redis)

# APP ENVIRONMENT

environment = AttrDict(
    redis=redis,
    history_len=config.getint("logic", "history_len"),
    history_ttl=timedelta(days=config.getint("logic", "history_ttl"))
)
