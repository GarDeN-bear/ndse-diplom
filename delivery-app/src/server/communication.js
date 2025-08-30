import Chats from "../db/chat/chats.js";

export default function initChatHandlers(io) {
  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.passport && session.passport.user) {
      socket.userId = session.passport.user;
      return next();
    }
    next(new Error("Authentication error"));
  });

  io.on("connection", (socket) => {
    socket.chatSubscriptions = new Map();

    const subscribeToChat = (chatId) => {
      if (socket.chatSubscriptions.has(chatId)) {
        const unsubscribe = socket.chatSubscriptions.get(chatId);
        unsubscribe();
      }

      const unsubscribe = Chats.subscribe((data) => {
        if (data.chatId === chatId) {
          socket.emit("newMessage", {
            chatId: data.chatId,
            message: data.message,
          });
        }
      });

      socket.chatSubscriptions.set(chatId, unsubscribe);
    };

    socket.on("getHistory", async (interlocutorId) => {
      try {
        const users = [socket.userId, interlocutorId].sort();
        const chat = await Chats.findOne({ users });
        if (!chat) {
          socket.emit("chatHistory", []);
          return;
        }
        subscribeToChat(chat.id);
        const history = await Chats.getHistory(chat.id);
        socket.emit("chatHistory", history);
      } catch (error) {
        socket.emit("error", new Error("Failed getting history"));
      }
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { receiver, text } = data;
        await Chats.sendMessage({
          author: socket.userId,
          receiver: receiver,
          text: text,
        });
      } catch (error) {
        socket.emit("error", new Error("Failed sending message"));
      }
    });

    socket.on("disconnect", () => {
      socket.chatSubscriptions.forEach((unsubscribe, chatId) => {
        unsubscribe();
      });

      socket.chatSubscriptions.clear();
    });
  });
}
