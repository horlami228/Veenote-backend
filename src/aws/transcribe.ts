import AWS from './aws.js';
import getFormattedDateTime from '../utilities/dateTimeGenerator.js';
import axios from 'axios';
import fs from 'fs/promises';

const transcribeService = new AWS.TranscribeService({region: 'us-east-1'});

// const mediaFileUri = "s3://myveenotebucket/audio-2024-03-28-12-09-43";

const startTranscriptionJob = async (mediaFileUri: string) => {
  const params = {
    TranscriptionJobName: `MyTranscriptionJob-${getFormattedDateTime()}`,
    LanguageCode: 'en-US',
    MediaFormat: 'wav',
    Media: {
      MediaFileUri: mediaFileUri
    },
  };

  try {
    const data = await transcribeService.startTranscriptionJob(params).promise();
    console.log("Transcription Job started:", data);
    return data.TranscriptionJob?.TranscriptionJobName ?? '';
  } catch (err) {
    console.error("Error starting transcription job", err);
    throw err;
  }
};

const checkTranscriptionJobStatus = async (jobName: string) => {
    const params = {
        TranscriptionJobName: jobName
    };

    try {
        const data = await transcribeService.getTranscriptionJob(params).promise();
        console.log("Job Status:", data.TranscriptionJob?.TranscriptionJobStatus);
        return data.TranscriptionJob;
    } catch (err) {
        console.error("Error checking transcription job status", err);
        throw err;
    }
};

const fetchTranscriptionFile = async (transcriptionFileUri: string) => {
    if (!transcriptionFileUri) {
        throw new Error('No transcription file URI provided');
    }

    try {
        const response = await axios.get(transcriptionFileUri);
        console.log("Transcription File Content:", response.data);
        return response.data;
    } catch (err) {
        console.error("Error fetching transcription file", err);
        throw err;
    }
};

const waitForStatusUpdate = (jobName: string, interval = 30000) => new Promise((resolve, reject) => {
    const checkStatus = async () => {
        try {
            const job = await checkTranscriptionJobStatus(jobName);
            if (job && (job.TranscriptionJobStatus === 'COMPLETED' || job.TranscriptionJobStatus === 'FAILED')) {
                resolve(job);
            } else {
                setTimeout(checkStatus, interval);
            }
        } catch (error) {
            reject(error);
        }
    };
    checkStatus();
});

export const transcribeMe = async (mediaUri: string) => {
try {
    const jobName = await startTranscriptionJob(mediaUri);
    console.log(`Transcription job started with name: ${jobName}`);

    const job = await waitForStatusUpdate(jobName);
    if ((job as any).TranscriptionJobStatus === 'COMPLETED') {
        const transcriptionContent = await fetchTranscriptionFile((job as any).Transcript.TranscriptFileUri);
        console.log("Transcription Content:", transcriptionContent);
        return transcriptionContent;
    } else {
        throw new Error(`Transcription job ${jobName} failed.`);
    }
} catch (err) {
    console.error("Error in transcription process", err);
    throw err;
  }
};

const saveTranscriptToFile = async (transcript: any, fileName: string) => {
    try {
      await fs.writeFile(fileName, transcript, 'utf8');
      console.log(`Transcript saved to ${fileName}`);
    } catch (err) {
      console.error('Error saving transcript to file:', err);
    }
  };

  
export const decodeTranscript = async (transcription: any)  => {
    let fullTranscript = '';

    if (transcription && transcription.results && transcription.results.transcripts) {
        transcription.results.transcripts.forEach((transcriptObj: any) => {
            fullTranscript += transcriptObj.transcript + ' ';
        });
        console.log("Full Transcript:", fullTranscript.trim());
        saveTranscriptToFile(fullTranscript.trim(), 'transcript.txt'); // Save to file
        return fullTranscript.trim();
    } else {
        console.log("No transcription available.");
    }
};


// const transcription = await transcribeMe();
// const fullTranscript = await decodeTranscript(transcription);

// console.log("Full Transcript:", fullTranscript);
