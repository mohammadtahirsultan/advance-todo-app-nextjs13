import { checkAuth, connectDB, getAuth } from '../../utils/database'
import Task from '../../models/task'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware';

export default async (req, res) => {
    try {

        await connectDB()

        const user = await checkAuth(req)

        if (!user) return errorMiddleWare(res, "Login First!")

        let tasks = await Task.find({ user: user._id })

        if (!tasks) return res.status(404).json({
            success: false,
            message: "Task Not Found",
        });

        return res.status(201).json({
            success: true,
            tasks,
            user
        });
    } catch (error) {
        return errorMiddleWare(res, error.message)
    }
};


