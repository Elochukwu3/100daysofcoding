
import { Request, Response } from 'express';
import { getAllStates, getStateById, getStateByName } from '../services/state.service';
import { HttpStatus } from '../../common/enums/StatusCodes';

export const getStates = (req: Request, res: Response) => {
  const states = getAllStates();
  if (!states.length) {
    return res.status(HttpStatus.BadRequest).json({ message: 'No states found' });
  }
  
  res.json(states);
};

export const getState = (req: Request, res: Response) => {
  const stateId = parseInt(req.params.id, 10);
  const state = getStateById(stateId);
  if (!state) {
    return res.status(HttpStatus.BadRequest).json({ message: 'State not found' });
  }
  res.json({
    "status": "success",
    "data": state,
    "message": "State found successfully"
  });
};

export const getByName =  (req: Request, res: Response) => {
  const stateName = req.params.name;


  try {
    const state = getStateByName(stateName);
    res.json({
      "status": "success",
      "data": state,
      "message": "State found successfully"
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(404).json({ message: errorMessage });
  }
};
