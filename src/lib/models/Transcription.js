import mongoose from "mongoose";

const TranscriptionSchema = new mongoose.Schema({
  transcription: { type: String, required: true },   
  enhanced: { type: String, required: true },      

  audio: {
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String }   
  },

  metadata: {
    summary: { type: String },                     
    topics: { type: String },                   
    filename: { type: String },                  
    upload_date: { type: String },              
    language: { type: String, default: "ar" }
  },

  tasks: { type: String },                        
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Transcription = mongoose.model("Transcription", TranscriptionSchema);
export default Transcription;
