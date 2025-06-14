import Transcription from "../../lib/models/Transcription.js";
import path from "path";
import fs from "fs";

export const createTranscription = async (req, res) => {
  try {
    const { transcription, enhanced, summary, tasks, topics, User } = req.body;

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

    let audioInfo = null;
    if (req.file) {
      const audioPath =  req.file.filename
      audioInfo = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `\\${audioPath.replace(/\\/g, "\\")}`,   
      };
    }

    const newEntry = await Transcription.create({
      enhanced,
      transcription,
      audio: audioInfo,
      metadata: {
        summary,
        topics,
        filename: req.file?.originalname || "recording.wav",
        upload_date: new Date().toISOString(),
        language: "ar",
      },
      tasks,
      user: userId,
    });

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
    return res.status(200).json({
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
};
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
};
export const getTranscriptionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const transcriptions = await Transcription.find({ user: userId })
      .populate("user", "userName")     
      .sort({ createdAt: -1 });

    if (!transcriptions || transcriptions.length === 0) {
      return res.status(404).json({
        message: "No transcriptions found for this user.",
        success: false,
      });
    }

    const response = transcriptions.map((item) => ({
      id: item._id,
      transcription: item.transcription,
      enhanced: item.enhanced,
      summary: item.metadata?.summary,
      topics: item.metadata?.topics,
      tasks: item.tasks,
      audio: item.audio?.url
        ? {
            filename: item.audio.originalName,
            downloadUrl: item.audio.url,
          }
        : null,
      userName: item.user?.userName,
      upload_date: item.metadata?.upload_date,
    }));

    return res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching user transcriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

