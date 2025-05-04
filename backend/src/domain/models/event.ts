import mongoose, { Document, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface Event extends Document {
  eventId: string;
  date: Date;
  country: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  price: number;
  availableSeats: number;
}

const EventSchema = new Schema<Event>({
  eventId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  country: { type: String, required: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  league: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true }
});

EventSchema.index({ country: 1 });
EventSchema.index({ league: 1 });
EventSchema.index({ homeTeam: 1 });
EventSchema.index({ awayTeam: 1 });
EventSchema.index({ date: 1 });

EventSchema.plugin(mongoosePaginate);

export type EventPaginationModel = PaginateModel<Event>;
export const Event = mongoose.model<Event, EventPaginationModel>("Event", EventSchema);