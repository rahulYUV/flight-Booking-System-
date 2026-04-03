import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const Flight = mongoose.model('Flight', new mongoose.Schema({ source: String, destination: String }));
async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const total = await Flight.countDocuments();
  const patnaSource = await Flight.countDocuments({ source: /Patna/i });
  const patnaDest = await Flight.countDocuments({ destination: /Patna/i });
  console.log(`TOTAL_FLIGHTS: ${total}`);
  console.log(`PATNA_SOURCE: ${patnaSource}`);
  console.log(`PATNA_DEST: ${patnaDest}`);
  await mongoose.disconnect();
}
run();
