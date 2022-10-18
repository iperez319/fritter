import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Comment} from '../comment/model';

/**
 * This file defines the properties stored in a Report
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Report = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  reportee: Types.ObjectId;
  parent: Types.ObjectId;
  parentType: 'Comment' | 'Freet';
  dateCreated: Date;
};

export type PopulatedReport = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  reportee: Types.ObjectId | User;
  parent: Types.ObjectId | Freet | Comment;
  parentType: 'Comment' | 'Freet';
  dateCreated: Date;
};

const ReportSchema = new Schema<Report>({
  reportee: {
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
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const ReportModel = model<Report>('Report', ReportSchema);
export default ReportModel;
