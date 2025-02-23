import { type Request, type Response, type NextFunction } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

import { User } from "../interfaces/user";
import { userModel } from "../models/userModel";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../Repository/database";

/**
 * Register a new user
 * @param req
 * @param res
 */
export async function registerUser(req: Request, res: Response) {
  try {
    // validate user input
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    await connectToDatabase();
    // check if the email is already in the database
    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create the user
    const userObject = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await userObject.save();
    res.status(201).json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(500).json("Error registering user: " + error);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Login a user
 * @param req
 * @param res
 */
export async function loginUser(req: Request, res: Response) {
  try {
    // validate user input
    const { error } = validateUserLogin(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // find the user
    await connectToDatabase();
    const user: User | null = await userModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password." });
      return;
    } else {
      // create authentication token and send it to the user
      const validPassword: boolean = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(400).json({ error: "Invalid email or password." });
        return;
      }
      const userId: string = user.id;
      const token: string = jwt.sign(
        {
          email: user.email,
          id: userId,
        },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: "2h",
        }
      );
      // attach the token and send it to the user
      res
        .status(200)
        .header("auth-token", token)
        .json({ error: null, data: { userId, token } });
    }
  } catch (error) {
    res.status(500).json("Error logging in user: " + error);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Middleware to verify the token
 * @param req
 * @param res
 * @param next
 */
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ error: "Access denied." });
    return;
  }
  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();

  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
}

/**
 * Validate user registration
 * @param data
 */
export function validateUser(data: User): ValidationResult {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
}
/**
 * Validate user login
 * @param data
 */
export function validateUserLogin(data: User): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
}
