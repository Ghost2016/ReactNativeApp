'use strict';

import express from 'express';
import Sig from '../../controllers/sig/Sig'

const router = express.Router();

//|--------api for Sig----------|\\
router.get('/hash/:appid', Sig.hash);  //获取api记录审计
router.get('/hash', Sig.hash);

export default router;