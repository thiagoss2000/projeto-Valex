import { Request, Response} from "express";

export default function errorHandler (error: any, req: Request, res: Response) {
  console.log(error.response.stauts)
  if (error.response) {
    return res.status(error.response.status).send(error.response.message);
  }

  res.sendStatus(500); 
}