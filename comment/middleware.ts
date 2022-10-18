import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';
import * as freetValidator from '../freet/middleware';
/**
 * Checks if comment exists
 */
const doesCommentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {parentId} = req.body;

  const state = await CommentCollection.findById(parentId);

  if (state === null) {
    res.status(404).json({
      error: {
        message: `Comment with ID ${parentId} was not found`
      }
    });
    return;
  }

  next();
};

const doesParentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {parentType} = req.body;
  if (parentType === 'Comment') {
    return doesCommentExist(req, res, next);
  }

  if (parentType === 'Freet') {
    return freetValidator.isFreetExists(req, res, next);
  }
};

export {
  doesCommentExist,
  doesParentExist
};
