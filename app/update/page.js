"use client"
import React, { useContext, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import "./updateProfile.css";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Context } from '../../components/clients';
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader/Loader'
const UpdateProfile = () => {

    const { user, setUser } = useContext(Context);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState(user && user.image?.url ? user.image?.url : "/favicon.ico");
    const [loading, setLoading] = useState(false)

    const { push } = useRouter();

    const updateDataChange = (e) => {
        if (e.target.name === "image") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview(reader.result);
                    setImage(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const updateProfileSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        if (image) {
            formData.append("image", image);
        }

        try {
            setLoading(true)
            const { data } = await axios.put("/api/update/profile", formData, {
                headers: { "Content-Type": "application/json" }, withCredentials: true
            })

            toast.success(data.message)
            setUser(data.user);
            setLoading(false)
            if (data.success) {
                push("/profile")
            }
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
        }

    }
    return (
        <div className="updateProfileContainer">
            <div className="updateProfileBox">
                <h2 className="updateProfileHeading">Update Profile </h2>
                <form
                    className="updateProfileForm"
                    encType="multipart/form-data"
                    onSubmit={updateProfileSubmit}
                >
                    <div className="updateProfileName">
                        <FaUser />
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="updateProfileEmail">
                        <AiOutlineMail />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div id="updateProfileImage">
                        <img src={imagePreview} alt="User" />
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={updateDataChange}
                        />
                    </div>

                    {
                        loading ?
                            <Loader /> : <input
                                type="submit"
                                value={"Update Profile"}
                                className="updateProfileBtn"
                                disabled={loading} />
                    }
                </form>
            </div>
        </div>
    )
}

export default UpdateProfile