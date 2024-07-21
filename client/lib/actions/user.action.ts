"use server";
import User from "@/database/User.model";
import { connectToDatabase } from "../mongoose";
import { userActionInterface } from "@/interfaces";

export async function createUser(userData: userActionInterface) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
