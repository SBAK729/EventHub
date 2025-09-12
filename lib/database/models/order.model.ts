import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  _id: string;
  totalAmount: number;
  isFree: boolean;
  stripeId?: string;
  createdAt: Date;
  event?: {
    _id: string;
    title: string;
    price?: number;
    isFree?: boolean;
    startDateTime?: string | Date;
  };
}

const OrderSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  stripeId: {
    type: String,
    required: function (this: { isFree?: boolean }) {
      return !this.isFree; // required only if ticket is paid
    },
  },
  totalAmount: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  buyer: { type: Schema.Types.ObjectId, ref: "User" },
});

// Ensure stripeId is only unique when present (paid tickets). This avoids duplicate null errors.
OrderSchema.index(
  { stripeId: 1 },
  { unique: true, partialFilterExpression: { stripeId: { $exists: true, $type: 'string' } } }
);

// Prevent more than one ticket per user per event
OrderSchema.index({ buyer: 1, event: 1 }, { unique: true });

const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;
