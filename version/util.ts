import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Version, PopulatedVersion} from '../version/model';

// Update this if you add a property to the Freet type!
type VersionResponse = {
  _id: string;
  dateCreated: string;
  content: string;
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
 * Transform a raw version object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Version>} version - A version
 * @returns {VersionResponse} - The version object formatted for the frontend
 */
const constructVersionResponse = (version: HydratedDocument<Version>): VersionResponse => {
  const versionCopy: PopulatedVersion = {
    ...version.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...versionCopy,
    _id: versionCopy._id.toString(),
    dateCreated: formatDate(version.dateCreated)
  };
};

export {
  constructVersionResponse
};
