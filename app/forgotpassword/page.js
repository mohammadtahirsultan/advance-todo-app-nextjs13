"use client"
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import './ForgotPassword.css'
import { AiOutlineMail } from 'react-icons/ai'
import axios from "axios";
import Loader from "../../components/Loader/Loader";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false)

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const { data } = await axios.post("/api/forgetpassword", {
        email
      }, {
        headers: { "Content-Type": "application/json" }, withCredentials: true
      })

      if (!data.success) {
        setLoading(false)
        return toast.error(data.message)
      }

      if (data.success) {
        toast.success(data.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.message)
    }
  };

  return (
    <>

      <div className="forgotPasswordContainer">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Forgot Password </h2>
          <form
            className="forgotPasswordForm"
            onSubmit={forgotPasswordSubmit}
          >
            <div className="forgotPasswordEmail">
              <AiOutlineMail />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>


            {
              loading ?
                <Loader /> :
                <input
                  type="submit"
                  value={"Continue"}
                  className="forgotPasswordBtn"
                />}
          </form>
        </div>
      </div>

    </>
  );
};

export default ForgotPassword;
