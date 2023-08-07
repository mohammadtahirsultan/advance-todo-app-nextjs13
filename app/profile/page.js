"use client"
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import './profile.css'
import { Context } from '../../components/clients'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Profile = () => {


    const { user } = useContext(Context)

    const { push } = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (user === null || Object?.keys(user)?.length === 0) {
                push("/login");
            }
        }

    }, [push, user]);



    return (
        <>
            {
                user && <div className="profileContainer">
                    <div>
                        <h1>My Profile</h1>
                        <Image width={"100"} height={"250"} src={user.image?.url} alt={user.name} />
                        <Link href={"/update"}>Edit Profile</Link>
                    </div>
                    <div>
                        <div>
                            <p>Full Name</p>
                            <h4>{user.name}</h4>
                        </div>
                        <div>
                            <p>Email</p>
                            <h4>{user.email}</h4>
                        </div>
                        <div>
                            <p>Joined On</p>
                            <h4>{String(user.createdAt).substr(0, 10)}</h4>
                        </div>
                        <div>
                            <Link href={"/password/update"}>Change Password</Link>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Profile