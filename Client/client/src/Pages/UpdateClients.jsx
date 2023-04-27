import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateClients = () => {
    const [client,setClient] = useState({
        name:"",
        emailId:"",
        address:"",
        gender:"",
      });
    
      const navigate = useNavigate();
      const location = useLocation();
    
      const clientId = location.pathname.split("/")[2];
    
      const handleChange = async e =>{
        setClient(prev=>({...prev , [e.target.name]: e.target.value}))
      };
      const handleClick = async e =>{
          e.preventDefault()
          try{
            await axios.put("http://localhost:8800/client/"+clientId,client)
            navigate("/clients");
          }catch(err){
              console.log(err);
          }
        }
      
      
      console.log(client)
      return (
        <div className="form">
          <h1>Update Client Details</h1>
          <input type="text" name="name" onChange={handleChange} placeholder='Name' />
          <input type="text" name="emailId" onChange={handleChange} placeholder='Email id' />
          <input type="text" name="address" onChange={handleChange} placeholder='Address' />
          <input type="text" name="gender" onChange={handleChange} placeholder='Gender' />
          <button className="formButton" onClick={handleClick}>Update</button>
        </div>
      );
}

export default UpdateClients