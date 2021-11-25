import { Router } from "express";
import AuthRoute from './AuthRoute'
import UserRoute from './UserRoute'
import ArticleRoute from './ArticleRoute'
import { checkToken } from "../middlewares/checkToken";
import { checkRole } from "../middlewares/checkRole";

const root = Router()

root.use('/', AuthRoute)
//root.use('/users', [checkToken, checkRole(["ADMIN"])], UserRoute)
//root.use('/articles', [checkToken, checkRole(["ADMIN", "AUTHOR"])], ArticleRoute)

export default root