import { cookieSetter } from '../../utils/database'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware';
import { serialize } from 'cookie';

export default async (req, res) => {
    try {

        console.log("cookie deleted karne aya ");

        res.setHeader(
            "Set-Cookie",
            serialize("token", "", {
                path: "/",
                httpOnly: true,
                maxAge: 0,
            })
        );

        console.log("cookie deleted");
        return res.json({
            success: true,
            message: "Logged Out!",
        });

    } catch (error) {
        return errorMiddleWare(res, error.message)
    }
};


