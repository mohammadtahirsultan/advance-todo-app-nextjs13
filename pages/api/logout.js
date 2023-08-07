import { cookieSetter } from '../../utils/database'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware';
import { serialize } from 'cookie';

export default async (req, res) => {
    try {

        res.setHeader(
            "Set-Cookie",
            serialize("token", "", {
                path: "/",
                httpOnly: true,
                maxAge: 0,
            })
        );

        return res.cookie("token", "").json({
            success: true,
            message: "Logged Out!",
        });

    } catch (error) {
        return errorMiddleWare(res, error)
    }
};


