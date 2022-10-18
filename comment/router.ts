import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all comments for a given parent
 *
 * @name GET /api/comments/?parentId=
 *
 * @return {CommentResponse[]} - A list of all the comments for a given parent
 */

router.get(
  '/',
  async (req: Request, res: Response) => {
    const {parentId} = req.query;
    const comments = await CommentCollection.findByParentId(parentId);
    const response = comments.map(comment => util.constructCommentResponse(comment));
    res.status(200).json(response);
  }
);

/**
 * Posts a new comment to either a freet or another comment.
 *
 * @name POST /api/comments
 * @param {Types.ObjectId | string} parentId - The id of the parent which can be a comment or freet
 * @param {"Comment" | "Freet"} parentType - Type of the parent, it can be a freet or comment
 * @param {string} content - content of the comment
 * @return {CommentResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If one of the two users could not be found
 * @throws {409} - If user is already following the followee
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isCurrentSessionUserExists,
    userValidator.doUsersExist(['authorId'], 'body'),
    commentValidator.doesParentExist
  ],
  async (req: Request, res: Response) => {
    const {parentId, parentType, content} = req.body;
    const {userId: authorId} = req.session;

    const comment = await CommentCollection.addOne(authorId, parentId, parentType, content);

    res.status(201).json({
      message: 'Your comment was posted successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:commentId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the one of the users does not exist
 */
router.delete(
  '/:commentId',
  [
    userValidator.isUserLoggedIn,
    userValidator.isCurrentSessionUserExists
  ],
  async (req: Request, res: Response) => {
    const {commentId} = req.params;
    await CommentCollection.deleteOne(commentId);
    res.status(200).json({
      message: 'Your comment was deleted.'
    });
  }
);

export {router as followerRouter};
