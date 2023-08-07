import { errorMiddleWare } from "../../../../app/middleware/errorMiddleware";
import { User } from "../../../../models/user";
import crypto from 'crypto'
import { cookieSetter, generateToken, getAuth } from "../../../../utils/database";
import bcrypt from 'bcrypt'
import { serialize } from "cookie";

export default async (req, res) => {
    try {
        let resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.query.token)
            .digest(`hex`);

        let user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });



        if (!user) return errorMiddleWare(res, `Invalid or Expired Token is Entered`);

        if (req.body.password !== req.body.confirmPassword) {
            return errorMiddleWare(res, `Password Does Not Match`);
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const token = generateToken(user._id)

        res.setHeader(
            "Set-Cookie",
            serialize("token", token, {
                path: "/",
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            })
        );

        return res.json({
            success: true,
            message: "Password Reset Successfully"
        })

    } catch (error) {
        return errorMiddleWare(
            res, `Error Occured While Reset User Password ${error.message}`
        );
    }
}