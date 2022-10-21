import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Follower
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Version = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  content: string;
  parent: Types.ObjectId;
  dateCreated: Date;
  parentType: 'Comment' | 'Freet';
};

export type PopulatedVersion = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  content: string;
  parent: Types.ObjectId | Freet | Comment;
  dateCreated: Date;
  parentType: 'Comment' | 'Freet';
};

const VersionSchema = new Schema<Version>({
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
    default: Date.now
  }
});

const VersionModel = model<Version>('Version', VersionSchema);
export default VersionModel;
