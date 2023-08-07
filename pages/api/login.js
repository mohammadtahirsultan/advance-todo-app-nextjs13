import { connectDB, generateToken } from '../../utils/database'
import { User } from '../../models/user'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware';
import bcrypt from 'bcrypt'

export default async (req, res) => {

    if(req.method!=="POST") return errorMiddleWare(res,"This Method is not Allowed!")
    try {

        await connectDB()
        const { email, password } = req.body;

        let user = await User.findOne({ email }).select("+password")

        if (!user) {
            return errorMiddleWare(res, "User Does Not Exist!")
        }

        console.log("user mil gaya");

        const matchedPassword = await bcrypt.compare(password, user.password)

        if (!matchedPassword) {
            return errorMiddleWare(res, "Invalid Credentials!")
        }

        console.log("password match hogia");


        const token = generateToken(user._id)


        console.log("token ho gia ok,");

        res.setHeader(
            "Set-Cookie",
            serialize("token", token, {
                path: "/",
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
            })
        );

        console.log("cookie set ho gai ");


        console.log("logged in ");

        return res.status(201).json({
            success: true,
            message: "Registered Successfully!",
            user,
        });

    } catch (error) {
        return errorMiddleWare(res,error.message)
    }
};


