import {Document, Model, model, Schema} from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  preName: string;
  lastName: string;
}

export const UserSchema: Schema = new Schema({
  // eslint-disable-next-line max-len
  username: {type: String, required: true, unique: true, index: true},
  password: {type: String, required: true},
  email: {type: String, required: true, index: true},
  preName: {type: String, required: true},
  lastName: {type: String, required: true},
});

const User: Model<IUser> = model("User", UserSchema);
User.ensureIndexes().then(() => {
  logger.debug("ensure indexes for model 'User'", {"type": "database"});
});

export default User;
