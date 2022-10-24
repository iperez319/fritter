import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReportCollection from './collection';
import FreetCollection from '../freet/collection';
import CommentCollection from '../comment/collection';
import FollowerCollection from '../follower/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as reportValidator from './middleware';
import * as util from './util';
import type {HydratedDocument} from 'mongoose';
import type {PopulatedReport, Report} from './model';
import e from 'express';

const router = express.Router();
const SCAM_FLAG_THRESHOLD = 0.8; // Amount of reports in proportion to users followers before flagging freet as scam

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
    const reports = await ReportCollection.findByParentId(parentId as string);

    let result = false;
    if (reports.length > 0) {
      const report = reports[0] as PopulatedReport;
      const parent = report.parentType === 'Freet' ? await FreetCollection.findOne(report.parent) : await CommentCollection.findById(report.parent);
      const stats = await FollowerCollection.getFollowStats(parent.author._id || parent.author);
      result = reports.length > SCAM_FLAG_THRESHOLD * (stats.followers ?? 0);
    }

    res.status(200).json({
      flag: result
    });
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
    reportValidator.didReportPreviously
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

export {router as reportRouter};
