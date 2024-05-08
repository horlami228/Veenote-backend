import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load the AWS credentials from the .env file
dotenv.config({ path: "./dist/src/aws/.env"});

// Set the AWS credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default AWS;
