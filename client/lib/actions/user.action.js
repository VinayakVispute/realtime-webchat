"use server";
import User from "../../database/user.model";
import { connectToDatabase } from "../mongoose";

export async function createUser(userData) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
