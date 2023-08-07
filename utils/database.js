import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";
import { errorMiddleWare } from "../app/middleware/errorMiddleware";
import { NextResponse } from "next/server";
import { User } from '../models/user'
import nodemailer from 'nodemailer'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database is connected with ${process.env.MONGO_URL}`);
  } catch (error) {
    console.log(error);
  }
};



export const cookieSetter = (token, set) => {
  const cookieStore = cookies();

  cookieStore.set('token', token, {
    path: "/",
    httpOnly: true,
    maxAge: set ? 15 * 24 * 60 * 60 * 1000 : 0,
  });
};


export const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};


export const getAuth = async (req) => {

  const cookieStore = cookies()
  const tokenCookie = cookieStore.get('token')

  const token = tokenCookie.value;

  if (!token) {
    return errorMiddleWare(NextResponse, "Login First")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return await User.findById(decoded._id);
}


export const checkAuth = async (req) => {
  const cookie = req.headers.cookie;
  if (!cookie) return null;

  const token = cookie.split("=")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return await User.findById(decoded._id);
};




export const sendMail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
}