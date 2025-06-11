import mongoose from "mongoose";

const TranscriptionSchema = new mongoose.Schema({
  text: String,
  metadata: {
    language: String,
    main_point: String,
    tags: [String],
    filename: String,
    upload_date: String,
  },
  tasks: [
    {
      task: String,
      card_id: String,
      card_url: String,
    },
  ],
});

const Transcription = mongoose.model("Transcription", TranscriptionSchema);
export default Transcription;
