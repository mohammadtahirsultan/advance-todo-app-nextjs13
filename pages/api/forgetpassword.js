import { User } from '../../models/user'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware'
import { sendMail } from '../../utils/database';


export default async (req, res) => {
    try {

        if (req.method !== "POST") {
            return errorMiddleWare(res, "This Method is Not Allowed")
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) return errorMiddleWare(res, `User Does Not Exists`);

        let resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        let resetPasswordURL = `${process.env.FRONT_END_URL}/password/reset/${resetToken}`;

        let message = `You Requested For Password Reset , Your Reset Password Token is :- \n\n ${resetPasswordURL} \n\n If You Have Not Requested For Reset Password , Please Ignore this mail. `;

        try {
            await sendMail({
                email: user.email,
                subject: "Todo Next JS App, Password Reset Request",
                message,
            });

            return res.status(200).json({
                success: true,
                message: `Mail Sent to ${user.email} Successfully`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return errorMiddleWare(
                res, `Error Occured While Forget User Password ${error.message}`
            );
        }
    } catch (error) {
        return errorMiddleWare(
            res, `Error Occured While Forget User Password ${error.message}`
        );
    }

}