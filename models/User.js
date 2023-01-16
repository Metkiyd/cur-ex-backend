import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    wallets: Array,
    avatarUrl: String,
    city: String,
    birthday: String,
    phone: String,
  }, {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);