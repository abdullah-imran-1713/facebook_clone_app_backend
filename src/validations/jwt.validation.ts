import dotenv from 'dotenv';

dotenv.config();

const validateJwt = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  console.log("JWT Validation Successful")
};

const JWT_SECRET: string = process.env.JWT_SECRET as string;

export { validateJwt, JWT_SECRET };
