import { Request, Response } from "express";
import { Users } from "../entities/Users";
import { v4 as randomUUID } from 'uuid'
import jwt from 'jsonwebtoken'
import { validate } from "class-validator";

export class AuthController {

    static authenticated = async (req: Request, res: Response) => {
        
        try {
            const cookie = req.cookies['access_token']
            const payload = jwt.verify(cookie, process.env.JWT_SECRET) as any

            if (!payload) {
                return res.status(401).send({ message: `Unauthenticated` })
            }

            const user = await Users.findOne(payload.id)
            res.send(user)
        } catch (e) {
            res.status(401).send({ message: `Can't find token` })
        }
    }

    static register = async (req: Request, res: Response) => {

        try {
            const user = new Users(req.body)

            const errors = await validate(user)
            if (errors.length > 0) {
                return res.status(400).send(errors)
            }

            const result = await user.save()
            return res.send(result)
        } catch (e) {
            console.log(e)
            return res.status(400).send(e.message)
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email, pseudo, password } = req.body

        try {
            const query = Users.createQueryBuilder('user')
            .addSelect('user.password');
            if (email) {
                query.where('user.email = :email', { email })
            } else {
                query.where('user.pseudo = :pseudo', { pseudo })
            }
            const user = await query.getOne()

            if (!user) {
                return res.status(400).send({ message: "Invalid pseudo" })
            }

            if (!user.checkPassword(password)) {
                return res.status(404).send({ message: 'Invalid credentials' })
            }

            const uid = randomUUID();
            const token = jwt.sign(
                { id: user.id, uid },
                process.env.JWT_SECRET, {
                expiresIn: '1d'
            })

            res.cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: true
            })

            delete user.password
            return res.send({ user, uid })
        } catch (e) {
            console.log(e)
            res.status(400).send({ message: e.message })
        }
    }

    static logout = async (req: Request, res: Response) => {
        res.cookie('access_token', '', { maxAge: 0 })
        res.send({ message: 'success ' })
    }
}