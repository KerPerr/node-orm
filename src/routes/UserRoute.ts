import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get('/', UserController.read)
router.get('/:id', UserController.read)

router.get('/:id/articles', UserController.wrote)

router.delete('/', UserController.delete)
router.delete('/:id', UserController.delete)

export default router;