// Import the necessary modules
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import dotenv from 'dotenv';

// Load the AWS credentials from the .env file
dotenv.config({ path: "./src/aws/.env" });

// Create a new instance of the TranscribeStreamingClient using the credentials from the .env file
const client = new TranscribeStreamingClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

export default client;
