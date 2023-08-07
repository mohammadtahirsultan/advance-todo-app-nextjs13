import { cookieSetter } from '../../utils/database'
import { errorMiddleWare } from '../../app/middleware/errorMiddleware';

export default async (req, res) => {
    try {

        cookieSetter(null, false)

        return res.json({
            success: true,
            message: "Logged Out!",
        });

    } catch (error) {
        return errorMiddleWare(res, error)
    }
};


