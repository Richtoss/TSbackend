import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  name: string;
}

const JobSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model<IJob>('Job', JobSchema);
