import type {HydratedDocument, Types} from 'mongoose';
import type {Follower, PopulatedFollower} from './model';
import FollowerModel from './model';
import UserCollection from '../user/collection';

class FollowerCollection {
  /**
   * Add a freet to the collection
   *
   * @param {Types.ObjectId | string} follower - The id of the follower
   * @param {Types.ObjectId | string} followee - The id of the followee
   * @return {Promise<HydratedDocument<Follower>>} - The newly created Follower
   */
  static async addOne(follower: Types.ObjectId | string, followee: Types.ObjectId | string): Promise<HydratedDocument<Follower>> {
    const followerObj = new FollowerModel({
      follower,
      followee
    });
    await followerObj.save(); // Saves freet to MongoDB
    return (await followerObj.populate('follower')).populate('followee');
  }

  /**
   * Gets all the followers of a given user
   *
   * @param {Types.ObjectId | string} user - The id of the user
   * @return {Promise<HydratedDocument<Follower>>} - The newly created Follower
   */
  static async getAllFollowers(user: Types.ObjectId | string): Promise<Array<HydratedDocument<PopulatedFollower>>> {
    const followers = await FollowerModel.find({followee: user}).populate('follower');
    return followers;
  }

  /**
   * Checks if follower follows the followee
   *
   * @param {Types.ObjectId | string} follower - The id of the follower
   * @param {Types.ObjectId | string} followee - The id of the followee
   * @return {Promise<boolean>} - True if follower follows the followee
   */
  static async doesFollow(follower: Types.ObjectId | string, followee: Types.ObjectId | string): Promise<boolean> {
    return (await FollowerModel.findOne({follower, followee})) !== null;
  }

  /**
   * Returns the number of users that are following a given user and the number of users they are following.
   *
   * @param {Types.ObjectId | string} user - The id of the user
   * @return {Promise<{following: number, followers: number}>} - The stats of followers and following
   */
  static async getFollowStats(user: Types.ObjectId | string): Promise<{following: number; followers: number}> {
    const followers = ((await FollowerModel.find({followee: user})) || []).length;
    const following = ((await FollowerModel.find({follower: user})) || []).length;
    return {followers, following};
  }

  /**
   * Follwer unfollows the followee
   *
   * @param {Types.ObjectId | string} follower - The id of the follower
   * @param {Types.ObjectId | string} followee - The id of the followee
   * @return {Promise<boolean>} - The newly created Follower
   */
  static async unfollow(follower: Types.ObjectId | string, followee: Types.ObjectId | string): Promise<boolean> {
    const followerObj = await FollowerModel.deleteOne({follower, followee});
    return followerObj !== null;
  }
}

export default FollowerCollection;
