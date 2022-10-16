import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowerCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as followerValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all of the followers of a given user
 *
 * @name GET /api/followers/:userId
 *
 * @return {FollowerResponse[]} - A list of all the followers for a given users
 */

router.get(
  '/:userId',
  async (req: Request, res: Response) => {
    const {userId} = req.params;
    const followers = await FollowerCollection.getAllFollowers(userId);
    const response = followers.map(item => item.follower);
    res.status(200).json(response);
  }
);

/**
 * Follow a new user.
 *
 * @name POST /api/followers/:followerId/:followeeId
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If one of the two users could not be found
 * @throws {409} - If user is already following the followee
 */
router.post(
  '/:followerId/:followeeId',
  [
    userValidator.isUserLoggedIn,
    followerValidator.doUsersExist,
    followerValidator.doesFollowAlreadyExist
  ],
  async (req: Request, res: Response) => {
    const {followerId, followeeId} = req.params; // Will not be an empty string since its validated in isUserLoggedIn
    const followerObj = await FollowerCollection.addOne(followerId, followeeId);

    res.status(201).json({
      message: 'Your follow request was successfull.',
      follower: followerObj
    });
  }
);

/**
 * Unfollow a user
 *
 * @name DELETE /api/follower/:followerId/:followeeId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the one of the users does not exist
 */
router.delete(
  '/:followerId/:followeeId',
  [
    userValidator.isUserLoggedIn,
    followerValidator.doUsersExist
  ],
  async (req: Request, res: Response) => {
    const {followerId, followeeId} = req.params;
    await FollowerCollection.unfollow(followerId, followeeId);
    res.status(200).json({
      message: 'Your unfollow request was successfull.'
    });
  }
);

export {router as followerRouter};
