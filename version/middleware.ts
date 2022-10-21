import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from '../comment/middleware';

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
  doesParentExist
};
