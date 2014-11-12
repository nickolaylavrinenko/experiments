#!venv/bin/python

import click


@click.group()
def admin():
    pass


@admin.command()
@click.option("--port", default=0)
def start(port):
    # from tornado.httpserver import HTTPServer
    from tornado.ioloop import IOLoop
    from app import application
    from config import config

    # from utils.wsgi import ThreadedWSGIContainer

    bind = config.get("server", "bind")
    port = port or config.getint("server", "port")
    # threads = config.getint("chat", "threads")

    # container = ThreadedWSGIContainer(application, max_workers=threads)
    # http_server = HTTPServer(container)
    # http_server.listen(port, address=bind)
    # IOLoop.instance().start()

    application.listen(port, address=bind)
    print('Listening for %s:%d' % (bind, port))
    IOLoop.instance().start()


if __name__ == "__main__":
    admin()
