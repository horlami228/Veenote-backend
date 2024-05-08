import s3 from './s3Bucket.js';
import * as fs from 'fs';
import * as path from 'path';
import dateTimeGenerator from '../utilities/dateTimeGenerator.js';

// const myString = 'Hello, this is a test string!'; // Your string data
// const bucketName = 'myveenotebucket'; // Replace with your bucket name
// const key = 'myTestString1.txt'; // The key is the name of the object in the bucket

// s3.upload({
//     Bucket: bucketName,
//     Key: key,
//     Body: myString,
//     ContentType: 'text/plain',
//     ACL: 'public-read',
//     }, (err, data) => {
//     if (err) {
//         console.log('Error', err);
//     } else {
//         console.log('Upload Success', data.Location);
//     }
// });

// s3.getObject({ Bucket: bucketName, Key: key }, (err, data) => {
//     if (err) {
//       console.error("Error", err);
//     } else {
//       // Assuming the file is text-based, convert the buffer to a string
//       const objectContent = data.Body.toString('utf-8');
//       console.log(objectContent);
//     }
//   });


export const uploadFile = async (audioFile: any, mimeType: any) => {
  try {
      const params: AWS.S3.PutObjectRequest = {
          Bucket: 'myveenotebucket', // Replace with your bucket name
          Key: `audio-${dateTimeGenerator()}`,
          Body: audioFile,
          ContentType: mimeType,
      };

      const data = await s3.upload(params).promise();
      const s3Uri = `s3://${params.Bucket}/${params.Key}`;
      console.log(data.Location);
      console.log(`S3 URI: ${s3Uri}`);
      return s3Uri;
  } catch (err) {
      console.error("Error", err);
      throw err; // Make sure to throw the error to handle it in the caller function
  }
};


