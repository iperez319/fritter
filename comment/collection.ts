import type {HydratedDocument, Types} from 'mongoose';
import type {Comment, PopulatedComment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';

class CommentCollection {
  /**
   * Add a comment to another comment or a freet
   *
   * @param {Types.ObjectId | string} authorId - The id of the author
   * @param {Types.ObjectId | string} parentId - The id of the parent which can be a comment or freet
   * @param {"Comment" | "Freet"} parentType - Type of the parent, it can be a freet or comment
   * @param {string} content - content of the comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly created Follower
   */
  static async addOne(authorId: Types.ObjectId | string, parentId: Types.ObjectId | string, parentType: 'Comment' | 'Freet', content: string): Promise<HydratedDocument<Comment>> {
    const comment = new CommentModel({
      author: authorId,
      parent: parentId,
      parentType,
      content
    });
    await comment.save(); // Saves freet to MongoDB
    return comment;
  }

  /**
   * Gets all of the comments for a given parent
   *
   * @param {Types.ObjectId | string} parentId - The id of the user
   * @return {Promise<HydratedDocument<Comment>[]>} - The newly created Commenet
   */
  static async findByParentId(parentId: Types.ObjectId | string): Promise<Array<HydratedDocument<PopulatedComment>>> {
    const comments = await CommentModel.find({parent: parentId});
    return comments;
  }

  /**
   * Gets comment with a specific id
   *
   * @param {Types.ObjectId | string} commentId - The id of the user
   * @return {Promise<HydratedDocument<Comment>[]>} - The newly created Commenet
   */
  static async findById(commentId: Types.ObjectId | string): Promise<HydratedDocument<PopulatedComment>> {
    const comment = await CommentModel.findById(commentId);
    return comment;
  }

  /**
   * Deletes comment with a specific id
   *
   * @param {Types.ObjectId | string} commentId - The id of the user
   * @return {Promise<Boolean>} - Returns true if the comment was deleted
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.findOneAndDelete({_id: commentId});
    return comment !== null;
  }
}

export default CommentCollection;
