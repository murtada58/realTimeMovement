import asyncio
import json
import logging
import pathlib
import ssl
import websockets

SERVER_IP = "176.58.109.37" # set to "localhost" or your servers ip if you want to host your own server
PORT = 6080

logging.basicConfig()

USERS = {}

async def game(websocket, path):
    try:
        print("new user connected")
        USERS[websocket] = [275, 275]
        websockets.broadcast(USERS, json.dumps({"type": "update", "players": [USERS[player] for player in USERS]}))
        async for message in websocket:
            data = json.loads(message)
            if data["action"] == "move":
                USERS[websocket] = data["pos"]
                websockets.broadcast(USERS, json.dumps({"type": "update", "players": [USERS[player] for player in USERS]}))

            else:
                logging.error("unsupported event: %s", data)
    finally:
        del USERS[websocket]
        websockets.broadcast(USERS, json.dumps({"type": "update", "players": [USERS[player] for player in USERS]}))
        print("user removed")

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
cert = "/etc/letsencrypt/live/websockettictactoe.co.uk/fullchain.pem"
key = "/etc/letsencrypt/live/websockettictactoe.co.uk/privkey.pem"
ssl_context.load_cert_chain(cert, keyfile=key)

async def main():
    async with websockets.serve(game, SERVER_IP, PORT, ssl=ssl_context):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())