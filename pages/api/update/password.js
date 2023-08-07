import { errorMiddleWare } from "../../../app/middleware/errorMiddleware";
import { User } from "../../../models/user";
import { checkAuth, connectDB } from "../../../utils/database";
import bcrypt from 'bcrypt'

export default async (req, res) => {

    if (req.method !== "PUT") {
        return errorMiddleWare(res, "This Method is Not Allowed")
    }
    try {

        await connectDB()

        const { oldPassword, newPassword, confirmPassword } = req.body;

        let user = await checkAuth(req)

        user = await User.findById(user._id).select("+password")

        if (!user) return errorMiddleWare(res, "Login First!")

        const isMatched = await bcrypt.compare(oldPassword, user.password);

        if (!isMatched){
            return errorMiddleWare(res, `Old Password Does Not Match`)
        }

        if (newPassword !== confirmPassword) {
            return errorMiddleWare(res, `Password and Confirm Password Does Not Match`)
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully!",
            user
        });

    } catch (error) {
        return errorMiddleWare(res, error.message)
    }

};




