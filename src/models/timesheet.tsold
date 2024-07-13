import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeEntry {
  date: Date;
  jobName: string;
  hours: number;
}

export interface ITimesheet extends Document {
  user: mongoose.Types.ObjectId;
  weekStart: Date;
  entries: ITimeEntry[];
  totalHours: number;
  status: 'in_progress' | 'completed';
}

const TimesheetSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  entries: [{
    date: { type: Date, required: true },
    jobName: { type: String, required: true },
    hours: { type: Number, required: true },
  }],
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
});

export default mongoose.model<ITimesheet>('Timesheet', TimesheetSchema);
