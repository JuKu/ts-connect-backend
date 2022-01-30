import {Document, Model, model, Schema} from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  salt: string,
  email: string;
  preName: string;
  lastName: string;
  tokenSecret: string;
  country: string;
  gender: number;
  globalRoles: Array<string>;
  globalPermissions: Array<string>;
}

export const UserSchema: Schema = new Schema({
  // eslint-disable-next-line max-len
  username: {type: String, required: true, unique: true, index: true},
  password: {type: String, required: true},
  salt: {type: String, required: true},
  email: {type: String, required: true, index: true},
  preName: {type: String, required: true},
  lastName: {type: String, required: true},
  // this is an additional secret for JWT tokens,
  // so the token can be invalidated
  tokenSecret: {type: String, required: true},
  country: {type: String, required: true},
  // 0 - male, 1 - female, 2 - diverse
  gender: {
    type: Number,
    enum: [0, 2],
    default: 0,
    required: true,
  },
  globalRoles: [{
    type: String,
  }],
  globalPermissions: [{
    type: String,
  }],
});

const User: Model<IUser> = model("User", UserSchema);
User.ensureIndexes().then(() => {
  logger.debug("ensure indexes for model 'User'", {"type": "database"});
});

export default User;
