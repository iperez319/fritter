import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowerCollection from '../follower/collection';

/**
 * Checks if users exists
 */
const doUsersExist = async (req: Request, res: Response, next: NextFunction) => {
  const {followerId, followeeId} = req.params;
  if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followeeId)) {
    res.status(404).json({
      error: {
        userNotFound: `User with ID ${followerId} or ${followeeId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if users exists
 */
const doesFollowAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
  const {followerId, followeeId} = req.params;

  const state = await FollowerCollection.doesFollow(followerId, followeeId);

  if (state) {
    res.status(409).json({
      error: {
        alreadyFollowing: `User with ID ${followerId} is already following user with ID ${followeeId}`
      }
    });
    return;
  }

  next();
};

export {
  doUsersExist,
  doesFollowAlreadyExist
};
