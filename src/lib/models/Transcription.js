import mongoose from "mongoose";

const TranscriptionSchema = new mongoose.Schema({
  transcription: { type: String, required: true }, // النص الأصلي
  enhanced: { type: String,required:true },                      // النص المحسن
  metadata: {
    summary: { type: String },                     // الملخص
    topics: { type: String },                      // المواضيع كسطر نصي
    filename: { type: String },                    // اسم الملف
    upload_date: { type: String },                 // تاريخ الرفع
    language: { type: String, default: "ar" },     // اللغة الافتراضية
  },
  tasks: { type: String },                         // قائمة المهام كسطر نصي
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Transcription = mongoose.model("Transcription", TranscriptionSchema);
export default Transcription;