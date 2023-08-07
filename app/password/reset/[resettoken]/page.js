"use client"
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "./ResetPassword.css";
import { AiFillLock, AiFillUnlock } from 'react-icons/ai'
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "../../../../components/Loader/Loader";

const ResetPassword = ({ params }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const { push } = useRouter()

    const token = params.resettoken

    const resetPasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const { data } = await axios.put(`/api/reset/password/${token}`, {
                password, confirmPassword,
            }, {
                headers: { "Content-Type": "application/json" }, withCredentials: true
            })

            if (!data.success) return toast.error(data.message)

            if (data.success) {
                setLoading(false)
                toast.success(data.message);
                push("/")
            }
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                    <h2 className="resetPasswordHeading">Reset Password </h2>
                    <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
                        <div className="resetPassword">
                            <AiFillLock />
                            <input
                                type="password"
                                placeholder="New Password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="resetPassword">
                            <AiFillUnlock />
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
                                    value={"Continue"}
                                    className="resetPasswordBtn"
                                />}
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
