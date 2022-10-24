import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Follower
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Follower = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  follower: Types.ObjectId;
  followee: Types.ObjectId;
};

export type PopulatedFollower = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  follower: User | Types.ObjectId;
  followee: User | Types.ObjectId;
};

const FollowerSchema = new Schema<Follower>({
  follower: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followee: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const FollowerModel = model<Follower>('Follower', FollowerSchema);
export default FollowerModel;
