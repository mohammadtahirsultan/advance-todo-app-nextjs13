import { connectDB, getAuth } from '../../../utils/database'
import Task from '../../../models/task'
import { NextResponse } from 'next/server';
import { errorMiddleWare } from '../../middleware/errorMiddleware';


export const GET = async (req, res) => {
    try {

        await connectDB()

        const user = await getAuth(req)

        if (!user) return errorMiddleWare(NextResponse, "Login First!")

        let tasks = await Task.find({ user: user._id })

        if (!tasks) return NextResponse.json({
            success: false,
            message: "Task Not Found",
        });

        return NextResponse.json({
            success: true,
            tasks,
        });
    } catch (error) {
        return errorMiddleWare(NextResponse, "Login First!")
    }
};


