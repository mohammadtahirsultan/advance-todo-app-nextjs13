import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import { connectDB, generateToken } from '../../utils/database';
import { User } from '../../models/user'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware';
import { serialize } from 'cookie';

export default async (req, res) => {

    if (req.method !== "POST") {
        return errorMiddleWare(res, "This Method is Not Allowed")
    }

    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    });
    try {

        await connectDB()

        const { name, email, password, image } = req.body;

        if (!name || !email || !password || !image) return errorMiddleWare(res, "Please Input all the Fields")

        const myCloud = await cloudinary.v2.uploader.upload(image, {
            folder: "todo-users",
            width: 150,
            crop: "scale",
        });

        let user = await User.findOne({ email });

        if (user) {
            return errorMiddleWare(res, "User Already Exist!")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user = await User.create({
            name, email,
            password: hashedPassword,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });

        const token = generateToken(user._id)

        res.setHeader(
            "Set-Cookie",
            serialize("token", token, {
                path: "/",
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
            })
        );


        return res.status(201).json({
            success: true,
            message: "Registered Successfully!",
            user,
        });


    } catch (error) {
        return errorMiddleWare(res, error.message)
    }

};
