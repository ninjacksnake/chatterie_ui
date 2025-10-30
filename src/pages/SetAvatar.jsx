import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/Color-Loading.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";

const SetAvatar = () => {
  /// const api = "https://api.multiavatar.com/45678945";  api down
  // const api = "https://api.dicebear.com/6.x/avataaars/svg"; another api

  const navigate = useNavigate();
  const [user, setUser] = useState(undefined);
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const toastOptions = {
    draggable: true,
    position: "bottom-center",
    autoClose: 8000,
    pauseOnHover: true,
    theme: "dark",
  };

  useEffect(() => {
    async function checkLogin() {
    let Islogged = localStorage.getItem("chat-app-user") ? true : false;
    if (!Islogged) {
      navigate("/login");
    } else {
      setUser(JSON.parse(localStorage.getItem("chat-app-user")));
     let avatarList = await generateAvatars();
     setAvatars(avatarList);
     setIsloading(false);
    }
  }
  checkLogin();

  }, []);

  const generateAvatars = async () => {
    if (isGenerating) return; // Prevent multiple calls 
    setIsGenerating(true);
    const avatarList = [];
    for (let i = 0; i < 3; i++) {
      let avatar = await generate();
      avatarList.push(Buffer.from(avatar).toString("base64"));
    }
    return avatarList;
  };

  const generate = async () => {
    let avatar = createAvatar(openPeeps, {
      seed: Math.round(Math.random() * 1000),
      scale: 90,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffeedb"],
      backgroundType: ["solid", "gradientLinear", "gradientRadial"],
      accessoriesProbability: 30,
      accessories: ["glasses", "glasses2", "glasses4", "sunglasses", "eyepatch"],
      clothingColor: ["8fa7df", "9ddadb", "78e185", "f4b9b2", "f4d150", "ffffff"],
    }).toString();
    return avatar;
  }


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
  // useEffect(() => {
  //   const data = [];

  //   // const fetchData = async () => {
  //   //   for (let i = 0; i < 3; i++) {
  //   //     const image = await axios.get(
  //   //       `${api}/${Math.round(Math.random() * 1000)}`
  //   //     );
  //   //     const bufferImage = new Buffer(image.data);
  //   //     data.push(bufferImage.toString("base64"));
  //   //   }
  //  // };
  //   // fetchData()
  //   //   .then((response) => {
  //   //     setAvatars(data);
  //   //     setIsloading(false);
  //   //   })
  //     // .catch((error) => {
  //     //   if (error.response.status === 503) {
  //     //     console.error("Too many requests to avatar api  try in 1 minute");
  //     //   }
  //     // });
  // }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" height={150} style={{ borderRadius: "50%" }} />
          <h1 style={{ "color": "white" }}>Loading...</h1>
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
                  className={`avatar ${selectedAvatar === index ? "selected" : ""
                    }`}
                >
                  <img
                  loading="lazy"
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
