// routes for AWS services
import { Router } from 'express';
import { uploadAudio } from '../controller/awsService/uploadBucket.js';
import { transcribeAudio } from '../controller/awsService/transcribeService.js';
import { authMiddleware } from '../controller/auth/authController.js';
import multer from 'multer';

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const router = Router();

router.post('/upload', upload.single('audio'), uploadAudio);

router.post('/transcribe', transcribeAudio);

export default router;
