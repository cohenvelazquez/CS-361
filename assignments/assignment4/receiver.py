import zmq

# Create context and socket
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5555")

# Receive message
message = socket.recv_string()
print(f"Received message: {message}")

# Send reply (acknowledgement)
socket.send_string("Acknowledged")