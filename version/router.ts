import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import VersionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as versionValidator from './middleware';
import * as util from './util';
import type {Version} from './model';
import type {HydratedDocument} from 'mongoose';

const router = express.Router();

/**
 * Get list of versions for a given parent
 *
 * @name GET /api/versions/?parentId=
 *
 * @return {VersionResponse[]} - A list of all the comments for a given parent
 */

router.get(
  '/', [versionValidator.doesParentExist], async (req: Request, res: Response) => {
    const {parentId} = req.query;
    const versions = await VersionCollection.findByParentId(parentId as string);
    const response = versions.map(version => util.constructVersionResponse(version as HydratedDocument<Version>));
    res.status(200).json(response);
  }
);

export {router as versionRouter};
