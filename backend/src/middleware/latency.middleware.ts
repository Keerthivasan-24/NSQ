import { Request, Response, NextFunction } from 'express';

export const latencyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const latencyHeader = req.header('X-Simulate-Latency');
  const latencyQuery = req.query.latency;
  
  const latencyValue = latencyHeader || (typeof latencyQuery === 'string' ? latencyQuery : null);
  const delayMs = latencyValue ? parseInt(latencyValue, 10) * 1000 : 0;
  
  if (delayMs > 0 && !isNaN(delayMs)) {
    setTimeout(() => {
      next();
    }, delayMs);
  } else {
    next();
  }
};
