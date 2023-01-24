import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/Color-Loading.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    draggable: true,
    position: "bottom-center",
    autoClose: 8000,
    pauseOnHover: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, []);

  const setAvatarPicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar picture", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      await axios
        .post(`${setAvatarRoute}/${user._id}}`, {
          image: avatars[selectedAvatar],
        })
        .then((response) => {
          let data = response.data;
          console.log('after response',data);
          if (data.isSet) {
          //  localStorage.clear();
            user.isAvatarSet = true;
            user.avatar = data.image;
            localStorage.setItem("chat-app-user", JSON.stringify(user));
            navigate("/");
          } else {
            toast.error(
              "Ther was an error picking your avatar try again.",
              toastOptions
            );
          }
        }).catch((error)=>{
        //  toast.error("There was an error setting ", toastOptions)
        })
    }
  };
  useEffect(() => {
    const data = [];
    const fetchData = async () => {
      for (let i = 0; i < 3; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const bufferImage = new Buffer(image.data);
        data.push(bufferImage.toString("base64"));
      }
    };
    fetchData()
      .then((response) => {
        setAvatars(data);
        setIsloading(false);
      })
      .catch((error) => {
        if (error.response.status === 503) {
          console.error("Too many requests to avatar api  try in 1 minute");
        }
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Choose your avatar</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setAvatarPicture}>
            Set Avatar
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #131324;
  width: 100vw;
  height: 100vh;
  gap: 3rem;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4 rem solid transparent;
      padding: 0.5rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
