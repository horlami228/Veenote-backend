// This controller is used to upload a file to the S3 bucket

import { uploadFile } from '../../aws/s3Upload.js';
import { Request, Response } from 'express';

export const uploadAudio = async (req: Request, res: Response) =>  {
    console.log(req.file);
    if (!req.file) {
        res.status(400).send({ message: 'No audio file uploaded' });
        return;
    }

    const audio = req.file.buffer;
    const mimeType = req.file.mimetype;

    uploadFile(audio, mimeType)
    .then((s3Uri) => {
        console.log(s3Uri);
        res.status(200).json({ message: 'Audio file uploaded', s3Uri: s3Uri });
    })
    .catch((error) => {
        console.error("Error", error.message);
        res.status(500).send({ message: error.message });
    });
};


