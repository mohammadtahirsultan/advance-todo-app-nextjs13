
'use client'

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import '../app/header.css'

export const Context = createContext({ user: null })

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/api/profile").then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                }
            })
    }, [])


    return <Context.Provider value={{ user, setUser }}> {children} <Toaster /> </Context.Provider>
}

export const Navbar = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false)

    return (


        <nav className="navigation">
            <Link href="/" className="brand-name">
                Todo App
            </Link>

            <button className="hamburger" onClick={() => {
                setIsNavExpanded(!isNavExpanded);
            }} >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                >
                    <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            <div
                className={isNavExpanded ? "navigation-menu expanded" : "navigation-menu"}>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/profile">Profile</Link>
                    </li>
                    <li>
                        <Button />
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export const Button = () => {

    const { push } = useRouter()
    const { user, setUser } = useContext(Context)

    const logoutHandler = async (e) => {
        e.preventDefault()

        const { data } = await axios.get(`/api/logout`, {
            withCredentials: true
        })

        if (data.success) {
            localStorage.removeItem('isLoggedIn');
            setUser(null);
            toast.success(data.message)
            push("/login");
        }

    }


    return (
        <>
            {
                user?._id ? <button className="logoutBtn" onClick={logoutHandler}>Logout</button>
                    : <Link href={"/login"}>Login</Link>
            }
        </>
    )
}



export const TodosButton = ({ isCompleted, id }) => {


    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)

    const router = useRouter()

    const deleteHandler = async (id) => {
        try {
            setLoading(true)
            toast.success("Loading...")
            const { data } = await axios.delete(`/api/task/${id}`, {
                withCredentials: true
            })

            toast.success(data.message)
            router.refresh()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
        }

    }

    const updateHandler = async (id) => {
        try {
            setUpdateLoading(true)
            toast.success("Loading...")
            const { data } = await axios.put(`/api/task/${id}`, {
                withCredentials: true
            })

            toast.success(data.message)
            router.refresh()
            setUpdateLoading(false)
        } catch (error) {
            setUpdateLoading(false)
            toast.error(error.response.data.message)
        }
    }


    return <>
        <input disabled={updateLoading} type="checkbox" checked={isCompleted} onChange={() => updateHandler(id)} />
        <button disabled={loading} className='btn' onClick={() => deleteHandler(id)}>Delete</button>
    </>
}
