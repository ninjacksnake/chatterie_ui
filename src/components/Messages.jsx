import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const Messages = ({ messages }) => {
 
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      {messages.map((message, index) => {
        return (
          <div key={uuidv4()} ref={scrollRef}>
            <div
              className={`message ${message.fromSelf ? "sended" : "received"}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
margin-top: 10px;
  height: 80%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: white;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      font-size: 1.1rem;
      padding: 1rem;
      border-radius: 1rem;
      color: white;
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #0a15e620;
    }
  }
  .received {
    justify-content: flex-start;
    .content {
      background-color: #5d439cea;
    }
  }
`;
export default Messages;
