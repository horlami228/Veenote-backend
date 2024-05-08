import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function generateSecretKey () {
    const envFilePath = path.join('dist', 'src', 'config', '.env');

    // Generate a random secret key
    const secretKey = crypto.randomBytes(32).toString('hex');

    // Create a string in the format key=value
    const envContent = `JWT_SECRET_KEY=${secretKey}`;

// if (process.env.NODE === 'production') {
//     // Write the string to the .env file
//     fs.writeFileSync(envFilePath, envContent);

//     console.log('.env file created with secret key:', secretKey);

// }

fs.writeFileSync(envFilePath, envContent);

}

export default generateSecretKey;

generateSecretKey();

