import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';
import * as freetValidator from '../freet/middleware';
/**
 * Checks if comment exists
 */
const doesCommentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {commentId: commentIdBody} = req.body;
  const {commentId: commentIdParams} = req.params;

  const commentId = commentIdBody as string || commentIdParams;

  const state = await CommentCollection.findById(commentId);

  if (state === null) {
    res.status(404).json({
      error: {
        message: `Comment with ID ${commentId} was not found`
      }
    });
    return;
  }

  next();
};

const doesParentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {parentId, parentType} = req.body;
  if (parentType === 'Comment') {
    req.body.commentId = parentId as string;
    return doesCommentExist(req, res, next);
  }

  if (parentType === 'Freet') {
    req.params.freetId = parentId as string;
    return freetValidator.isFreetExists(req, res, next);
  }
};

const currentUserIsAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const {commentId} = req.params;
  const {userId} = req.session;

  const comment = await CommentCollection.findById(commentId);

  if (comment.author !== userId) {
    res.status(403).json({
      message: 'Not authorized to modify this comment'
    });
    return;
  }

  next();
};

export {
  doesCommentExist,
  doesParentExist,
  currentUserIsAuthor
};
