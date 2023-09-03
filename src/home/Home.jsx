import React, { useState } from "react";
import "./Home.css";
import axios from "axios";
import { backendUrl } from "../../backendUrl";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate=useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    try {
        const url=backendUrl();
        console.log(url);
      console.log(name);
      console.log(email);

      const data = {
        email,
        name,
      };
      console.log("flow reached here 1");
      const result = await axios.post(url, data, {
        withCredentials: true,
      });
      sessionStorage.setItem('id',result.data.result._id);
     console.log(result);
      navigate('/recording');
    } catch (err) {
        console.log(err);   
    }
  };

  return (
    <div className="Home--container">
      <div className=" Home--form">
        <div>
          {" "}
          <label>Name: </label>
          <input
            name="name"
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          ></input>
        </div>

        <br></br>
        <br></br>
        <div>
          <label>Email: </label>
          <input
            name="email"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          ></input>
        </div>
        <br></br>
        <br></br>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Home;
