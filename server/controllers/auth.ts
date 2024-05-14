import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { Request, Response } from "express";
import { IUser } from "../types/models";
import { uploadProfileImage } from "../utils/cloudinary";

const register = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    throw new BadRequestError("Please provide name, email and password");
  }
  const user: IUser = await User.create({ ...req.body });
  const token = user.createJWT();
  return res.status(StatusCodes.CREATED).json({
    name: user.name,
    isAdministrator: user.isAdministrator ?? false,
    profilePicture: user.profilePicture,
    token,
    msg: "Registration successful",
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  return res.status(StatusCodes.OK).json({
    name: user.name,
    isAdministrator: user.isAdministrator ?? false,
    profilePicture: user.profilePicture,
    token,
    msg: "Login successful",
  });
};

const sendDetails = async (req: Request, res: Response) => {
  // waut 2 seconds
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthenticatedError("Unauthorized");
  }
  const token = user.createJWT();
  return res.status(StatusCodes.OK).json({
    name: user.name,
    isAdministrator: user.isAdministrator ?? false,
    profilePicture: user.profilePicture,
    token,
    msg: "User details sent",
  });
};

const profile = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).select(
    "email name profilePicture -_id",
  );
  if (!user) {
    throw new UnauthenticatedError("Unauthorized");
  }
  return res.status(StatusCodes.OK).json({
    user,
    msg: "User details sent",
  });
};

const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthenticatedError("Unauthorized");
  }
  const { name } = req.body;
  user.name = name;
  await user.save();
  const { email, profilePicture: pp } = user;
  return res.status(StatusCodes.OK).json({
    user: { email, name, profilePicture: pp },
    msg: "Profile updated successfully",
  });
};

const passwordChange = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthenticatedError("Unauthorized");
  }
  const { currentPassword, newPassword } = req.body;
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid current password");
  }
  user.password = newPassword;
  await user.save();
  return res.status(StatusCodes.OK).json({
    msg: "Password changed successfully",
  });
};

const uploadProfilePicture = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthenticatedError("Unauthorized");
  }
  const cloudinary_url = await uploadProfileImage(req);
  user.profilePicture = cloudinary_url;
  await user.save();
  const { email, name, profilePicture } = user;
  return res.status(StatusCodes.OK).json({
    user: { email, name, profilePicture },
    msg: "Profile picture uploaded successfully",
  });
};

export {
  register,
  login,
  sendDetails,
  profile,
  passwordChange,
  updateProfile,
  uploadProfilePicture,
};
