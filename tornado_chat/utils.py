
__all__ = ['AttrDict']


class AttrDict(dict):

    def __init__(self, *args, **kwargs):
        dict.__init__(self, *args, **kwargs)
        self.__dict__ = self
