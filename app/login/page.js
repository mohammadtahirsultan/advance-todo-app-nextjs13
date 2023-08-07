"use client"
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Context } from '../../components/clients'
import axios from 'axios'
import { useRouter } from "next/navigation";
const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { user, setUser } = useContext(Context);

  const { push } = useRouter()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`/api/login`, {
        email, password
      }, {
        headers: {
          "Content-Type": "application/json",
        }, withCredentials: true
      })

      if (!data.success) return toast.error(data.message)
      if (data.success) {
        toast.success(data.message)
        setUser(data.user);
        localStorage.setItem('isLoggedIn', 'true');
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    // Check if the user is logged in from local storage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true' && user !== null) {
      push('/profile');
    }
  }, [user, push]);

  return (
    <div className='login'>
      <section>
        <form onSubmit={submitHandler}>

          <input type="email" name='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Link href={"/forgotpassword"} style={{ width: "60vw", textAlign: "right" }}>Forgot Password ?</Link>
          <button type='submit' disabled={false}>Login</button>
          <h2>Or</h2>
          <Link href={"/register"}>SignUp</Link>
        </form>
      </section>
    </div>
  )
}

export default Login