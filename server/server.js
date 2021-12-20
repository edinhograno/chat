const io = require("socket.io")(process.env.PORT || 5000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log(id, "Conectado");
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.multicast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
      console.log(newRecipients);
    });
  });
});
