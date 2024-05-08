import s3 from './src/aws/s3Bucket.js';
const key = "audio-2024-03-28-00-34-51";
const bucketName = "myveenotebucket";

s3.getObject({ Bucket: bucketName, Key: key }, (err, data) => {
    if (err) {
      console.error("Error", err);
    } else {
      // Assuming the file is text-based, convert the buffer to a string
      const objectContent = data.Body;
      console.log(objectContent);
    }
  });


