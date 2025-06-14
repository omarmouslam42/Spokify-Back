import Transcription from "../../lib/models/Transcription.js";

export const createTranscription = async (req, res) => {
  try {
    const { transcription, enhanced, summary, tasks, topics,User } = req.body;

    if (!transcription) {
      return res.status(400).json({
        message: "Transcription text is required.",
        success: false,
      });
    }

    const userId = User; 
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    } 

    const newEntry = await Transcription.create({
      enhanced, 
      transcription,
      metadata: { 
        summary,
        topics,
        filename: "recording.wav", 
        upload_date: new Date().toISOString(),
        language: "ar", 
      }, 
      tasks,
      user: userId,
    });
console.log(newEntry); 

    return res.status(201).json({
      message: "Transcription saved successfully",
      success: true,
      data: newEntry,
    });
  } catch (error) {
    console.error("Error saving transcription:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllTranscriptions = async (req, res) => {
  try {
    const transcriptions = await Transcription.find().sort({ createdAt: -1 }); 
    console.log("✅ Done fetching.", transcriptions);
   return  res.status(200).json({
      success: true,
      count: transcriptions.length,
      data: transcriptions,
    });
  } catch (error) {
    console.error("Error getting transcriptions:", error);

   return res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve transcriptions.",
    });
  }
};


export const getTranscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transcription = await Transcription.findById(id);

    if (!transcription) {
      return res.status(404).json({
        message: "Transcription not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: transcription,
    });
  } catch (error) {
    console.error("Error getting transcription by ID:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}
export const deleteTranscription = async (req, res) => {
  try {
    const { id } = req.params;
    const transcription = await Transcription.findByIdAndDelete(id);

    if (!transcription) {
      return res.status(404).json({
        message: "Transcription not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Transcription deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error deleting transcription:", error);
    
  }
}