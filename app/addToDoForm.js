"use client"
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
const TodoForm = () => {

  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { data } = await axios.post(`api/newtask`, {
        title, description
      }, {
        headers: {
          "Content-Type": "application/json",
        }, withCredentials: true
      })

      setTitle("")
      setDescription("")
      toast.success(data.message)
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div className='login'>
      <section>
        <form onSubmit={submitHandler}>

          <input type="text" name='title' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" name='descrition' placeholder='Descrition ' value={description} onChange={(e) => setDescription(e.target.value)} required />
          <button type='submit' disabled={loading}>Add Task</button>
        </form>
      </section>
    </div>
  )
}

export default TodoForm