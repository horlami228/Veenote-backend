import AWS from './aws.js';

// Create an S3 service object
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export default s3;
