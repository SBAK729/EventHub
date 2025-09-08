import { Schema, model, models, Document } from 'mongoose'

export interface IOrder extends Document {
  _id: string;
  status: "completed" | "pending" | string; // adjust if you have more statuses
  quantity: number;
  totalAmount: string;
  createdAt: string | Date;
  event?: {
    _id: string;
    title: string;
    imageUrl?: string;
    location?: string;
    price?: string;
    isFree?: boolean;
    category?: {
      name: string;
    };
    startDateTime?: string | Date;
  }
}

export type IOrderItem = {
  _id: string
  totalAmount: string
  createdAt: Date
  eventTitle: string
  eventId: string
  buyer: string
}

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
  
})

const Order = models.Order || model('Order', OrderSchema)

export default Order