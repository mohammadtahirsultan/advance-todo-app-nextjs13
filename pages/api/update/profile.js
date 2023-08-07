import { errorMiddleWare } from "../../../app/middleware/errorMiddleware";
import { User } from "../../../models/user";
import { checkAuth, connectDB } from "../../../utils/database";
import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export default async (req, res) => {

    if (req.method !== "PUT") {
        return errorMiddleWare(res, "This Method is Not Allowed")
    }

    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    });
    try {

        await connectDB()

        const { name, email } = req.body;

        let user = await checkAuth(req)

        user = await User.findById(user._id)

        if (!user) return errorMiddleWare(res, "Login First!")

        // Image Deletion and Updation Code Starts Here
        if (req.body?.image) {
            if (user.image && user.image.public_id) {
                let userImageId = user.image.public_id;
                await cloudinary.v2.uploader.destroy(userImageId);

                const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
                    folder: "todo-users",
                    width: 150,
                    crop: "scale",
                });

                user.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }
        // Image Deletion and Updation Code Ends Here

        if (name) {
            user.name = name
        }

        if (email) {
            let existingEmail = await User.findOne({ email });
            if (existingEmail) return errorMiddleWare(res, "This Email is Already Registered!")
            user.email = email
        }


        await user.save()

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully!",
            user
        });


    } catch (error) {
        return errorMiddleWare(res, error.message)
    }

};


