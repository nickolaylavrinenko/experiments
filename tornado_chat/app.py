from tornado.websocket import WebSocketHandler
from tornado.web import Application, url, HTTPError
from environment import environment


print('Starting app...')

rooms = {}


class WebSocketChatHandler(WebSocketHandler):

    room_id = None
    env = environment

    def __init__(self, *args, **kwargs):
        print('>>> create new handler instance')
        return WebSocketHandler.__init__(self, *args, **kwargs)

    def check_origin(self, origin):
        return True

    def open(self, room_id):

        if not room_id:
            raise HTTPError(400)

        # register in room
        if room_id not in rooms:
            rooms[room_id] = []
        if self not in rooms[room_id]:
            rooms[room_id].append(self)
        self.room_id = room_id
        print(">>> open websocket to room " + room_id)
        print(">>> rooms_dict " + str(rooms))

        # TODO load history from storage
        messages = self.env.redis.lrange(room_id,
                                         -self.env.history_len,
                                         -1)
        for message in messages:
            if message:
                self._send_message_to_all(message)
        self.env.redis.expire(self.room_id, self.env.history_ttl)

    def on_message(self, message):

        if self._is_in_room() and message:
            # send message to all clients
            self._send_message_to_all(message)
            print('>>> message - ', str(message), str(self.room_id))
            # store message

            result = self.env.redis.rpush(self.room_id, message)
            self.env.redis.expire(self.room_id, self.env.history_ttl)
            print('>>> saved to storage', result)

    def on_close(self):
        if self._is_in_room():
            # remove client from room
            rooms[self.room_id].remove(self)
            print('>>> user exit room ', self.room_id)
            # remove room if room is empty
            if not rooms[self.room_id]:
                del rooms[self.room_id]
                print('>>> close room ', self.room_id)
                self.room_id = None

    def _is_in_room(self):
        return self.room_id \
            and self.room_id in rooms \
            and self in rooms[self.room_id]

    def _send_message_to_all(self, message):
        if message:
            for client in rooms[self.room_id]:
                client.write_message(message)


application = Application([
    url(r"/room/(\w+)",
        WebSocketChatHandler, name="chat_room"),
])
