import { connectDB, getAuth } from '../../../utils/database'
import Task from '../../../models/task'
import { NextResponse } from 'next/server';
import { errorMiddleWare } from '../../middleware/errorMiddleware';


export const POST = async (req, res) => {
  try {

    await connectDB()
    const { title, description } = await req.json();

    const user = await getAuth(req)

    if (!user) return errorMiddleWare(NextResponse, "Login First!")


    let task = await Task.create({
      title,
      description,
      user: user._id,
    });

    return NextResponse.json({
      success: true,
      message: "Task Added Successfully!",
      task,
    });
  } catch (error) {
    return errorMiddleWare(NextResponse, "Login First!")
  }
};


