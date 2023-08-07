
export const errorMiddleWare = (res,message) => {

    message = message || "Internal Server Error!"

    return res.json({
        success: false,
        message,
    });
}

