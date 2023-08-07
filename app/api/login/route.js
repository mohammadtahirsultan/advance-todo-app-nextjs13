import { connectDB, cookieSetter, generateToken } from '../../../utils/database'
import { User } from '../../../models/user'
import { NextResponse } from 'next/server';
import { errorMiddleWare } from '../../middleware/errorMiddleware';
import bcrypt from 'bcrypt'

export const POST = async (req, res) => {
    try {

        await connectDB()
        const { email, password } = await req.json();

        let user = await User.findOne({ email }).select("+password")

        if (!user) {
            return errorMiddleWare(NextResponse, "User Does Not Exist!")
        }

        const matchedPassword = await bcrypt.compare(password, user.password)

        if (!matchedPassword) {
            return errorMiddleWare(NextResponse, "Invalid Credentials!")
        }

        const token = generateToken(user._id)

        cookieSetter(token, true)

        return NextResponse.json({
            success: true,
            message: `Welcome Back ${user.name} !`,
            user,
        },
            {
                headers: { 'Set-Cookie': `token=${token}` }
            });

    } catch (error) {
        return errorMiddleWare(NextResponse)
    }
};


