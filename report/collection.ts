import type {HydratedDocument, Types} from 'mongoose';
import type {Report, PopulatedReport} from './model';
import ReportModel from './model';
import UserCollection from '../user/collection';

class ReportCollection {
  /**
   * Reports a given freet, or comment as spam
   *
   * @param {Types.ObjectId | string} reporteeId - The id of the reportee
   * @param {Types.ObjectId | string} parentId - The id of the parent which can be a comment or freet
   * @param {"Comment" | "Freet"} parentType - Type of the parent, it can be a freet or comment
   * @return {Promise<HydratedDocument<Report>>} - The newly created report
   */
  static async addOne(reporteeId: Types.ObjectId | string, parentId: Types.ObjectId | string, parentType: 'Comment' | 'Freet', content: string): Promise<HydratedDocument<Report>> {
    const report = new ReportModel({
      reportee: reporteeId,
      parentId,
      parentType
    });
    await report.save(); // Saves freet to MongoDB
    return report;
  }

  /**
   * Gets report with a specific id
   *
   * @param {Types.ObjectId | string} reportId - The id of the user
   * @return {Promise<HydratedDocument<Report>[]>} - The report with the given id
   */
  static async findById(reportId: Types.ObjectId | string): Promise<HydratedDocument<PopulatedReport>> {
    const report = await ReportModel.findById(reportId);
    return report;
  }

  /**
   * Checks if reportee has already reported parent in the last 24 hours
   *
   * @param {Types.ObjectId | string} parentId - The id of the parent
   * @param {Types.ObjectId | string} reporteeId - The id of the reportee
   * @return {Promise<Boolean>} - Whether the user has already reported the parent
   */
  static async hasAlreadyReported(parentId: Types.ObjectId | string, reporteeId: Types.ObjectId | string): Promise<HydratedDocument<PopulatedReport>> {
    const report = await ReportModel.findOne({parent: parentId, reportee: reporteeId, dateCreated: {$gt: new Date(Date.now() - 24 * 60 * 60 * 1000)}});
    return report !== null;
  }

  /**
   * Gets all of the reports for a given parent withing 24 hours
   *
   * @param {Types.ObjectId | string} parentId - The id of the user
   * @return {Promise<HydratedDocument<Report>[]>} - The list of reports
   */
  static async findByParentId(parentId: Types.ObjectId | string): Promise<Array<HydratedDocument<PopulatedReport>>> {
    const report = await ReportModel.find({parent: parentId, dateCreated: {$gt: new Date(Date.now() - 24 * 60 * 60 * 1000)}});
    return report;
  }
}

export default ReportCollection;
