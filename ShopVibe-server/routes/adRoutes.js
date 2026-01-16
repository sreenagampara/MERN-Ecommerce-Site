import express from 'express'
import { fetchAd } from '../controllers/adControllers.js';

const adRoutes = express.Router();

adRoutes.get('/fetch-ad',fetchAd)

export default adRoutes;