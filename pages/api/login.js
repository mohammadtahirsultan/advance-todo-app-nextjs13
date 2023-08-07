import { connectDB, generateToken } from '../../utils/database'
import { User } from '../../models/user'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware';
import bcrypt from 'bcrypt'

export default async (req, res) => {

    if(req.method!=="POST") return errorMiddleWare(res,"This Method is not Allowed!")
    try {

        await connectDB()
        const { email, password } = await req.json();

        let user = await User.findOne({ email }).select("+password")

        if (!user) {
            return errorMiddleWare(res, "User Does Not Exist!")
        }

        const matchedPassword = await bcrypt.compare(password, user.password)

        if (!matchedPassword) {
            return errorMiddleWare(res, "Invalid Credentials!")
        }

        const token = generateToken(user._id)

        res.setHeader(
            "Set-Cookie",
            serialize("token", token, {
                path: "/",
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
            })
        );

        return res.status(200).json({
            success: true,
            message: `Welcome Back ${user.name} !`,
            user,
        },
            {
                headers: { 'Set-Cookie': `token=${token}` }
            });

    } catch (error) {
        return errorMiddleWare(res,error)
    }
};


