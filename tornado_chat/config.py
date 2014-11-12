# -*- coding: utf-8 -*-

import os.path
try:
    import configparser as configparser
except ImportError:
    import ConfigParser as configparser


__all__ = ['config']


ROOT = os.path.dirname(os.path.realpath(os.path.abspath(__file__)))

config = configparser.ConfigParser(
    interpolation=configparser.ExtendedInterpolation())
config.add_section('paths')
config.set('paths', 'root', ROOT)

config_path = os.path.join(ROOT, "config.ini")
local_config_path = os.path.join(ROOT, "config_local.ini")
files = [config_path, local_config_path]
config.read(files)
