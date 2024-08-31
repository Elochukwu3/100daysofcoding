// src/routes/userRoutes.ts

import { Router, Request, Response } from 'express';
import { User } from '../../interfaces/User';

const router = Router();


const users: User[] = [
  { id: 1, name: 'User 1', email: 'me@example.com' },
  { id: 2, name: 'User 2', email: 'you@example.com' },
  { id: 3, name: 'User 3', email: 'we@example.com' }
];

router.get('/users', (req: Request, res: Response<User[]>) => {
  res.json(users);
});


router.get('/users/:id', (req: Request, res: Response<User | { message: string }>) => {
  const userId: number = parseInt(req.params.id, 10);
  const user: User | undefined = users.find(u => u.id === userId);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;
