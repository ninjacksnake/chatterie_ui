import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { messagesRoute, socketHost as host } from "../utils/APIRoutes";
import ChatInput from "./ChatInput";
import LogOut from "./LogOut";
import Messages from "./Messages";
//import {v4 as uuidv4} from "./uuidv4";

function ChatContainer({ chat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);

  useEffect(() => {
    if (chat) {
      const getMessages = async () => {
        let result = await axios.post(`${messagesRoute}/getMessages`, {
          from: currentUser._id,
          to: chat._id,
        });
        return result;
      };
      getMessages().then((result) => setMessages(result.data.messages));
    }
  }, [chat]);

  const handleSendMessage = async (msg) => {
    // console.log(`${messagesRoute}/addMessage`)
    try {
      await axios.post(`${messagesRoute}/addMessage`, {
        from: currentUser._id,
        to: chat._id,
        message: {
          text: msg,
        },
      });

      socket.current.emit("send-message", {
        to: chat._id,
        from: currentUser._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setIncomingMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    incomingMessage &&
      setMessages((prev) => {
        console.log(prev)
        return [...prev, incomingMessage];
      });
  }, [incomingMessage]);

  return (
    <>
      {chat !== undefined ? ( //this is an if statement abreviated
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${chat.avatar}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{chat.username}</h3>
              </div>
            </div>
            <LogOut />
          </div>
          <Messages messages={messages} />
          <ChatInput
            handleSendMessage={handleSendMessage}
            currentUser={currentUser}
          />
        </Container>
      ) : (
        ""
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 79% 12%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-auto-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    .user-details {
      margin-left: 0.5rem;
      margin-top: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
`;

export default ChatContainer;
