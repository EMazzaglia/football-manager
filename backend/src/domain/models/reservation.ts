import mongoose, { Document, Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface Reservation extends Document {
  userId: string;
  eventId: string;
  spots: number;
  createdAt: Date;
}

const ReservationSchema = new Schema<Reservation>({
  userId: { type: String, required: true },
  eventId: { type: String, required: true },
  spots: { type: Number, required: true, min: 1, max: 2 },
  createdAt: { type: Date, default: Date.now },
},
  {
    versionKey: false,
  });

ReservationSchema.index({ userId: 1 });
ReservationSchema.index({ eventId: 1 });
ReservationSchema.index({ userId: 1, eventId: 1 }, { unique: false });
ReservationSchema.plugin(mongoosePaginate);

export type ReservationPaginationModel = PaginateModel<Reservation>;
export const Reservation = mongoose.model<Reservation, ReservationPaginationModel>(
  "Reservation",
  ReservationSchema
);