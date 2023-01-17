import React from "react";
import styled from "styled-components";
import LogOut from "./LogOut";

function ChatContainer({ chat }) {
  console.log(chat);
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
              <LogOut/>
          </div>
          <div className="chat-messages"></div>
          <div className="chat-input"></div>
        </Container>
      ) : (
        ""
      )}
    </>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    .user-details {
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
