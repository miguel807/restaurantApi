import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' },
  },
  { timestamps: true },
);
