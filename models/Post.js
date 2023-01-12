import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    number: {
      type: Number,
      required: true,
      unique: true,
      default: 0
    },
    currency: {
      type: String,
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      default: 0
    },
    transactions: {
      type: Array,
      default: [],
    },
    icon: {
      type: String,
      required: true,
    },
    sign: {
      type: String,
      required: true,
    },
  }, {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);