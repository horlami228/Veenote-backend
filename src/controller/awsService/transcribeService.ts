// This controller is used to transcribe the audio file in the S3 bucket

import { Request, Response } from 'express';
import {transcribeMe, decodeTranscript} from '../../aws/transcribe.js';

export const transcribeAudio = async (req: Request, res: Response) => {
    try {
        
        const mediaFileUri = req.body.mediaFileUri;

        if (!mediaFileUri) {
            res.status(400).send({ message: 'No media file URI provided' });
            return;
        }

        const transcription = await transcribeMe(mediaFileUri); // Transcribe the audio file
        const fullTranscript = await decodeTranscript(transcription); // Decode the transcription
        
        
        return res.status(200).json({ message: 'Transcription completed', fullTranscript: fullTranscript });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error", error.message);
            res.status(500).send({ message: error.message });
        }
    }
};
