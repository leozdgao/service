import {Router} from 'express';
import article from './article';

const router = Router();

router.use('/article', article);

export default router;
