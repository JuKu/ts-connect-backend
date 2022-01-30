import {Document, Model, model, Schema} from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  prename: string;
  lastName: string;
}

const UserSchema: Schema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
});

const User: Model<IUser> = model("User", UserSchema);

module.exports = UserSchema;
