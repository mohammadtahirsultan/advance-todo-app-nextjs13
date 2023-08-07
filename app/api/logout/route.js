import {  cookieSetter } from '../../../utils/database'
import { NextResponse } from 'next/server';
import { errorMiddleWare } from '../../middleware/errorMiddleware';

export const GET = async (req, res) => {
    try {

        cookieSetter(null, false)

        return NextResponse.json({
            success: true,
            message: "Logged Out!",
        });

    } catch (error) {
        return errorMiddleWare(NextResponse)
    }
};


