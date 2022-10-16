import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';

// Update this if you add a property to the Freet type!
type FollowerResponse = {
  _id: string;
  follower: string;
  followee: string;
};

