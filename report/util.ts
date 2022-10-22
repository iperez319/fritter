import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Report, PopulatedReport} from '../report/model';

// Update this if you add a property to the Freet type!
type ReportResponse = {
  _id: string;
  reportee: string;
  dateCreated: string;
  parent: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Report object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Report>} report - A report
 * @returns {ReportResponse} - The report object formatted for the frontend
 */
const constructReportResponse = (report: HydratedDocument<Report>): ReportResponse => {
  const reportCopy: PopulatedReport = {
    ...report.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...reportCopy,
    _id: reportCopy._id.toString(),
    dateCreated: formatDate(report.dateCreated),
    reportee: reportCopy.reportee.toString(),
    parent: reportCopy.parent.toString()
  };
};

export {
  constructReportResponse
};
