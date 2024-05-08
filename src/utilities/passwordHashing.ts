// Password hashing utility
import bcrypt from 'bcrypt';

const saltRounds = 13; // define the saltrounds

const bcryptHash = bcrypt;

// Generate a salt and hash the password

export const hashPassword = async (password: string) => {
    const salt = await bcryptHash.genSalt(saltRounds);
    const hashedPassword = await bcryptHash.hash(password, salt);
    return hashedPassword;
};

// Compare the password with the hashed password
export const comparePassword = async (password: string, hashedPassword: string) => {
    const isMatch = await bcryptHash.compare(password, hashedPassword);
    return isMatch;
};
