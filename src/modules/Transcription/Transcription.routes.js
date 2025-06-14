import express from "express";
import { createTranscription, deleteTranscription, getAllTranscriptions, getTranscriptionById, getTranscriptionsByUserId } from "../Transcription/Transcription.controller.js";
import { uploadAudio } from "../../utlis/uploadAudio.js";

const router = express.Router();

// protected route
router.post("/transcriptions", uploadAudio, createTranscription);
router.get("/transcriptions/getAll", getAllTranscriptions);
router.get("/getTrancriptionById/:id", getTranscriptionById);
router.get("/DeleteTrancriptionById/:id", deleteTranscription);
router.get("/transcriptions/user/:userId", getTranscriptionsByUserId);

export default router;   