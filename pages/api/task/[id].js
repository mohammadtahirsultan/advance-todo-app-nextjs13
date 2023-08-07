import { checkAuth, connectDB } from '../../../utils/database'
import Task from '../../../models/task'
import { errorMiddleWare } from '../../../app/middleware/errorMiddleware';


const handler = async (req, res) => {

    try {
        await connectDB();

        const user = await checkAuth(req)

        if (!user) return errorMiddleWare(res, "Login First!")

        const taskId = req.query.id;

        let task = await Task.findById(taskId);

        if (!task) return res.json({
            success: false,
            message: "Task Not Found",
        });

        if (req.method === "PUT") {
            task.isCompleted = !task.isCompleted;

            await task.save();

            res.status(200).json({
                success: true,
                message: "Task Updated Successfully",
            });
        } else if (req.method === "DELETE") {
            await task.deleteOne(task);

            res.status(200).json({
                success: true,
                message: "Task Deleted Successfully",
            });
        } else {
            return errorMiddleWare(res, "This Method is not Allowed!")
        }
    }
    catch (error) {
        return errorMiddleWare(res, error.message)
    }
}
export default handler;


