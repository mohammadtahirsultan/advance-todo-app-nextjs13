"use client"
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { AiFillLock, AiFillUnlock, AiTwotoneUnlock } from 'react-icons/ai'
import './updatePassword.css'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loader from '../../../components/Loader/Loader';


const UpdatePassword = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const { push } = useRouter()

    const updatePasswordSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { data } = await axios.put("/api/update/password", {
                oldPassword,
                newPassword,
                confirmPassword,
            }, {
                headers: { "Content-Type": "application/json" }, withCredentials: true
            })

            setLoading(false)
            if (!data.success) return toast.error(data.message)
            if (data.success) {
                toast.success(data.message)
                push("/profile")
            }
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
        }
    };


    return (
        <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
                <h2 className="updatePasswordHeading">Update Password </h2>
                <form
                    className="updatePasswordForm"
                    onSubmit={updatePasswordSubmit}
                >
                    <div className="updatePassword">
                        <AiFillLock />
                        <input
                            type="password"
                            placeholder="Old Password"
                            name="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="updatePassword">
                        <AiFillUnlock />
                        <input
                            type="password"
                            placeholder="New Password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="updatePassword">
                        <AiTwotoneUnlock />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>



                    {
                        loading ?
                            <Loader /> :
                            <input
                                type="submit"
                                value={"Update Password"}
                                className="updatePasswordBtn"
                            />}
                </form>
            </div>
        </div>)
}

export default UpdatePassword