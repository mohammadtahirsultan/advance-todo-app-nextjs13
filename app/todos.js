import React from 'react'
import { TodoItem } from '../components/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { redirect } from 'next/navigation';

const fetchTodos = async (token) => {
  try {
    const { data } = await axios.get(`https://advance-todo-app-nextjs13.vercel.app/api/mytask`, {
      cache: "no-cache",
      headers: {
        cookie: `token=${token}`,
      },
    })

    console.log("here is data line:16 todos.js", data);
    if (!data.success) return [];

    return data.tasks;

  } catch (error) {
    console.log(error);
    return [];
  }
}

const Todos = async () => {

  const token = cookies().get("token")?.value;

  if (!token) return redirect("/login")

  const tasks = await fetchTodos(token);

  console.log("here are the fetched tasks to render in Todos Componet",tasks);

  return (
    <div className='todosContainer'>
      {tasks && tasks.map((i) => (
        <TodoItem
          title={i.title}
          description={i.description}
          id={i._id}
          key={i._id}
          isCompleted={i.isCompleted}
        />
      ))}
    </div>
  )
}

export default Todos