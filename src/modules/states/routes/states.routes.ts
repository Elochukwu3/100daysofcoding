import { Router } from 'express';
import { getStates, getState } from '../controller/state.controller';

const router = Router();

router.get('/states', getStates);
router.get('/states/:id', getState);

export default router;
