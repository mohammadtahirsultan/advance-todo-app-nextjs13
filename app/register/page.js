"use client"
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { Context } from '../../components/clients'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { redirect } from "next/navigation";
import './register.css'

const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [image, setimage] = useState("/favicon.ico");
  const [imagePreview, setimagePreview] = useState("/favicon.ico");

  const { user, setUser } = useContext(Context);


  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("image", image);

    try {
      setLoading(true)
      const { data } = await axios.post(`/api/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        }, withCredentials: true
      })

      if (!data.success) {
        setLoading(false)
        return toast.error(data.message)
      }

      toast.success(data.message)
      setLoading(false)
      setUser(data.user);

    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.message)
    }

  }

  const registerDataChange = (e) => {
    if (e.target.name === "image") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setimagePreview(reader.result);
          setimage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (user?._id) return redirect("/");

  return (
    <div className='login'>
      <section>
        <form onSubmit={submitHandler} encType="multipart/form-data">

          <input type="text" name='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />

          <input type="email" name='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />

          <div id="registerImage">
            <img src={imagePreview} alt="User" />
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              onChange={registerDataChange}
            />
          </div>
          <button type='submit' disabled={loading}>Register</button>
          <h2>Or</h2>
          <Link href={"/login"}>Login</Link>
        </form>
      </section>
    </div>
  )
}

export default Register