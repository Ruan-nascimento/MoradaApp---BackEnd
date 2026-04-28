import { Router } from 'express';
import { helloWorldController } from '../controllers/helloWorld.controller';

const router = Router();

router.get('/hello', helloWorldController);

export default router;
