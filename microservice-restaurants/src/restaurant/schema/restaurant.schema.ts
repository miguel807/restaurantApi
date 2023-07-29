import * as mongoose from 'mongoose';

export const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  },
  { timestamps: true },
);

RestaurantSchema.index({ name: 1 }, { unique: true });
