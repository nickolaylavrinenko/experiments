from tornado.websocket import WebSocketHandler
from tornado.web import Application, url, HTTPError
from environment import environment
import constants
import ujson as json


print('Starting app...')

rooms = {}


class WebSocketChatHandler(WebSocketHandler):

    room_id = None
    env = environment

    def __init__(self, *args, **kwargs):

        print('>>> create new handler instance')
        return WebSocketHandler.__init__(self, *args, **kwargs)

    ### Socket methods ###

    def check_origin(self, origin):

        return True

    def open(self, room_id):

        if not room_id:
            raise HTTPError(400, 'Room id not provided')

        # register in room
        if room_id not in rooms:
            rooms[room_id] = []
        if self not in rooms[room_id]:
            rooms[room_id].append(self)
        self.room_id = room_id
        print(">>> open websocket to room " + room_id)
        print(">>> rooms_dict " + str(rooms))
        self.update_ttl()

    def on_message(self, message):

        if self.is_in_room and message:
            message_dict = json.loads(message)
            if isinstance(message_dict, dict):
                operation = message_dict.get('operation', '')
                # load history service message
                if operation == constants.SERVICE_OPERATIONS.GET_HISTORY:
                    self.load_history()
                # plain message
                elif not operation \
                        and 'text' in message_dict \
                        and 'user_name' in message_dict:
                    # send message to all clients and store it
                    self.send_message_to_all(message)
                    self.env.redis.rpush(self.room_id, message)
                    print('>>> message - ', str(message), str(self.room_id))
                self.update_ttl()

    def on_close(self):

        if self.is_in_room:
            # remove client from room
            rooms[self.room_id].remove(self)
            print('>>> user exit room ', self.room_id)
            # remove room if room is empty
            if not rooms[self.room_id]:
                del rooms[self.room_id]
                print('>>> close room ', self.room_id)
                self.room_id = None

    ### Other methods ###

    @property
    def is_in_room(self):

        return self.room_id \
            and self.room_id in rooms \
            and self in rooms[self.room_id]

    def send_message_to_all(self, message):

        if message:
            for client in rooms[self.room_id]:
                client.write_message(message)

    def load_history(self):

        if self.is_in_room:
            messages = self.env.redis.lrange(self.room_id,
                                             -self.env.history_len,
                                             -1)
            for message in messages:
                if message:
                    self.write_message(message)
            self.update_ttl()

    def update_ttl(self):

        self.env.redis.expire(self.room_id, self.env.history_ttl)


application = Application([
    url(r"/chat_room/(\w+)",
        WebSocketChatHandler, name="chat_room"),
])
