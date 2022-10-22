import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from '../comment/middleware';

const doesParentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {parentId, parentType} = req.body;
  if (parentType === 'Comment') {
    req.body.commentId = parentId as string;
    return commentValidator.doesCommentExist(req, res, next);
  }

  if (parentType === 'Freet') {
    req.params.freetId = parentId as string;
    return freetValidator.isFreetExists(req, res, next);
  }
};

export {
  doesParentExist
};
