import { Request, Response } from "express";
import User from "../models/User";
import { BadRequestError, UnauthenticatedError } from "../errors";
import Channel from "../models/Channel";
import SubEvent from "../models/SubEvent";
import { StatusCodes } from "http-status-codes";

const createChannel = async (req: Request, res: Response) => {
  const { channelName, subEventId } = req.body;
  if (!channelName || !subEventId) {
    throw new BadRequestError("Please provide hostId and eventId");
  }

  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestError("user not found");
  }

  const subEvent: any = await SubEvent.findById(subEventId);
  if (!subEvent) {
    throw new BadRequestError("subEvent not found");
  }

  const channel: any = new Channel({ channelName });
  if (!channel) {
    throw new BadRequestError("cannot create channel");
  }

  await channel.save();

  const updatedSubEvent = await SubEvent.findOneAndUpdate(
    { _id: subEventId },
    { $push: { channels: channel._id } },
    { new: true },
  );

  return res.status(StatusCodes.CREATED).json({
    channel,
    updatedSubEvent,
    msg: "new channel created",
  });
};

const getChannel = async (req: Request, res: Response) => {
  const { channelId } = req.body;
  const channel = await Channel.findById(channelId);

  if (!channel) {
    throw new BadRequestError("channel not found");
  }

  return res.status(StatusCodes.OK).json({
    channel,
    msg: "list of all the channels",
  });
};

export { getChannel, createChannel };
