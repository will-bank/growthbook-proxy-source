import express, {NextFunction, Request, Response} from "express";
import {registrar} from "../services/registrar";
import {adminMiddleware} from "../middleware/adminMiddleware";

const postEndpointsEntry = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.body.apiKey
  if (!apiKey) {
    return res.status(400).json({message: "API key required"});
  }
  try {
    registrar.setEndpointsByApiKey(apiKey, req.body);
  } catch(e) {
    console.error(e);
    return res.status(400).json({message: "API key required"});
  }
  return res.status(200).json({message: "success"});
};

const getEndpointsEntry = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.params.apiKey;
  if (!apiKey) {
    return res.status(400).json({message: "API key required"});
  }
  const data = registrar.getEndpointsByApiKey(apiKey);
  if (!data) {
    return res.status(404).json({message: "no endpoints found for that api key"});
  }
  return res.status(200).json(data);
}

const getAllEndpointsEntries = (req: Request, res: Response, next: NextFunction) => {
  const data = registrar.getAllEndpoints();
  return res.status(200).json(data);
}

const deleteEndpointsEntry = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.params.apiKey
  if (!apiKey) {
    return res.status(400).json({message: "API key required"});
  }
  const status = registrar.deleteEndpointsByApiKey(apiKey);
  if (!status) {
    return res.status(404).json({message: "no endpoints found for that api key"});
  }
  // todo: cleanup cache, sse
  return res.status(200).json({message: "success"});
};


export const adminRouter = express.Router();

adminRouter.post(
  '/endpoint',
  adminMiddleware,
  express.json(),
  postEndpointsEntry
);

adminRouter.get(
  '/endpoint/:apiKey',
  adminMiddleware,
  getEndpointsEntry
);

adminRouter.get(
  '/endpoints',
  adminMiddleware,
  getAllEndpointsEntries
);

adminRouter.delete(
  '/endpoint/:apiKey',
  adminMiddleware,
  deleteEndpointsEntry
);