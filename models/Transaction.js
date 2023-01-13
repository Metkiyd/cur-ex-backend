import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    send: {
      type: Number,
      required: true,
    },
    received: {
      type: Number,
      required: true,
    },
  }, {
    timestamps: true,
  },
);

export default mongoose.model('Transaction', TransactionSchema);