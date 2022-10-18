import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Follower
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Comment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: Types.ObjectId;
  content: string;
  parent: Types.ObjectId;
  dateCreated: Date;
  parentType: 'Comment' | 'Freet';
};

export type PopulatedComment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: Types.ObjectId | User;
  content: string;
  parent: Types.ObjectId | Freet | Comment;
  dateCreated: Date;
  parentType: 'Comment' | 'Freet';
};

const CommentSchema = new Schema<Comment>({
  author: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  parent: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref_path: 'parentType'
  },
  parentType: {
    type: String,
    enum: ['Comment', 'Freet']
  },
  content: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
