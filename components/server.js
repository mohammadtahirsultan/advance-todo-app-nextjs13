import React from 'react'
import { TodosButton } from './clients'
import { cookies } from 'next/headers'

export const TodoItem = ({ title, description, id, isCompleted }) => {
    console.log("here is the Todo Item Component", title, description, id, isCompleted);
    return (
        <div className='todo'>
            <div>
                <h4>{title} </h4>
                <p>{description} </p>
            </div>

            <div>
                <TodosButton id={id} isCompleted={isCompleted} />
            </div>
        </div>
    )
}


export const isAuthenticated = () => {
    const token = cookies().get("token")?.value;
    if (!token) return redirect("/login")
}

