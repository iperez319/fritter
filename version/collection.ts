import type {HydratedDocument, Types} from 'mongoose';
import type {Version, PopulatedVersion} from './model';
import VersionModel from './model';
import UserCollection from '../user/collection';

class VersionCollection {
  /**
   * Add a version for the parent
   *
   * @param {Types.ObjectId | string} parentId - The id of the parent which can be a comment or freet
   * @param {"Comment" | "Freet"} parentType - Type of the parent, it can be a freet or comment
   * @param {string} content - content of the version
   * @return {Promise<HydratedDocument<Version>>} - The newly created Follower
   */
  static async addOne(parentId: Types.ObjectId | string, parentType: 'Comment' | 'Freet', content: string): Promise<HydratedDocument<Version>> {
    const version = new VersionModel({
      parent: parentId,
      parentType,
      content
    });
    await version.save(); // Saves freet to MongoDB
    return version;
  }

  /**
   * Gets all of the versions of a given parent
   *
   * @param {Types.ObjectId | string} parentId - The id of the user
   * @return {Promise<HydratedDocument<Version>[]>} - The newly created Commenet
   */
  static async findByParentId(parentId: Types.ObjectId | string): Promise<Array<HydratedDocument<PopulatedVersion>>> {
    const version = await VersionModel.find({parent: parentId});
    return version;
  }

  /**
   * Gets version with a specific id
   *
   * @param {Types.ObjectId | string} versionId - The id of the version
   * @return {Promise<HydratedDocument<Version>[]>} - The version with the given id
   */
  static async findById(versionId: Types.ObjectId | string): Promise<HydratedDocument<PopulatedVersion>> {
    const version = await VersionModel.findById(versionId);
    return version;
  }

  /**
   * Deletes comment with a specific id
   *
   * @param {Types.ObjectId | string} versionId - The id of the version
   * @return {Promise<Boolean>} - Returns true if the version was deleted
   */
  static async deleteOne(versionId: Types.ObjectId | string): Promise<boolean> {
    const version = await VersionModel.findOneAndDelete({_id: versionId});
    return version !== null;
  }
}

export default VersionCollection;
