import zmq

# Create context and socket
context = zmq.Context()
socket = context.socket(zmq.REQ)
socket.connect("tcp://localhost:5555")

# Send message
message = "This is a message from CS361"
print(f"Sending message: {message}")
socket.send_string(message)

# Wait for reply (acknowledgement)
reply = socket.recv_string()
print(f"Received reply: {reply}")