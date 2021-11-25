import { Request, Response, NextFunction } from "express";
import { Users } from "../entities/Users";
import { getRepository } from "typeorm";

export const checkRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const payload = res.locals.payload
        //Get user role from the database
        try {
            const user: Users = await getRepository(Users).findOne(payload.id);
            //Check if array of authorized roles includes the user's role
            if (roles.indexOf(user.role) > -1) next();
            else res.status(401).send({message: 'Permission not granted'});
        } catch (e) {
            res.status(401).send({message: `User doesn't exist anymore`});
        }
    };
};