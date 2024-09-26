import { Request, Response } from 'express';
import { getAllStates, getStateById } from '../services/state.service';

export const getStates = (req: Request, res: Response) => {
  const states = getAllStates();
  if (!states.length) {
    return res.status(404).json({ message: 'No states found' });
  }
  
  res.json(states);
};

export const getState = (req: Request, res: Response) => {
  const stateId = parseInt(req.params.id, 10);
  const state = getStateById(stateId);
  if (!state) {
    return res.status(404).json({ message: 'State not found' });
  }
  res.json(state);
};
