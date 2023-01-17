import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

import { usersRoute } from "../utils/APIRoutes";

const Chat = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [chat, setChat] = useState(undefined);
  const [isLoaded, setisLoaded] = useState(false);
  
  useEffect(() => {
    // console.log(localStorage.getItem("chat-app-user"))
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      const setUser = async () => {
        let parsed = await JSON.parse(localStorage.getItem("chat-app-user"));
        return parsed;
      };
      setUser().then((user) => {
        setCurrentUser(user);
        setisLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    //asynchronously get the current user from db
    const getContacts = async (id) => {
      // console.log(id);
      let { data } = await axios.get(`${usersRoute}`);
      return data;
    };
    /*
     * if current user exists we check if user has avatar image.
     * if current user has avatar image then we call getContacts to get contact-
     * information from db  and set the contacts object with db information,
     * if not then we navigate to setAvatar page, useful when creating a new user.
     */

    if (currentUser) {
      console.log("currentUser", currentUser);
      if (currentUser.isAvatarSet) {
        getContacts(currentUser._id).then((data) => {
          //  console.log(data);
          setContacts(data);
        });
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setChat(chat);
  };

  return (
    <Container>
      <div className="container">
      
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />

        { isLoaded && chat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer chat={chat} />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #002333;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat;
