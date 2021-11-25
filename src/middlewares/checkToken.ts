import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    //Try to validate the token and get data
    try {
        const cookie = req.cookies['access_token']
        const payload = jwt.verify(cookie, process.env.JWT_SECRET) as any
        if (payload.uid != req.headers.uid) {
            res.status(401).send({ message: 'Falsified token' })
            return;
        }
        res.locals.payload = payload
    } catch (e) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({ message: `Invalid or expired token` });
        return;
    }
    //Call the next middleware or controller
    next();
};