import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReportCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as reportValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all reports for a given parent
 *
 * @name GET /api/report/?parentId=
 *
 * @return {ReportResponse[]} - A list of all the reports for a given parent
 */

router.get(
  '/',
  async (req: Request, res: Response) => {
    const {parentId} = req.query;
    const reports = await CommentCollection.findByParentId(parentId);
    const response = reports.map(report => util.constructReportResponse(report));
    res.status(200).json(response);
  }
);

/**
 * Posts a new report for either a freet or another comment.
 *
 * @name POST /api/reports
 * @param {Types.ObjectId | string} parentId - The id of the parent which can be a comment or freet
 * @param {"Comment" | "Freet"} parentType - Type of the parent, it can be a freet or comment
 * @return {ReportResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If parent was not found
 * @throws {403} - Reportee has already reported the parent within 24 hours
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isCurrentSessionUserExists,
    reportValidator.doesParentExist,
    reportValidator.userAlreadyReported
  ],
  async (req: Request, res: Response) => {
    const {parentId, parentType} = req.body;
    const {userId: reporteeId} = req.session;

    const report = await ReportCollection.addOne(reporteeId, parentId, parentType);

    res.status(201).json({
      message: 'Your report was posted successfully.',
      report: util.constructReportResponse(report)
    });
  }
);

export {router as followerRouter};
