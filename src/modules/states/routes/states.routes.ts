import { Router } from 'express';
import { getStates, getState, getByName } from '../controller/state.controller';

const router = Router();

// Get all states
router.get('/states', getStates);
router.get('/states/:id(\\d+)', getState);
router.get('/states/:name([a-zA-Z]+)', getByName);

export default router;
