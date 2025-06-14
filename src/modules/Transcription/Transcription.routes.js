import express from "express";
import { createTranscription, deleteTranscription, getAllTranscriptions, getTranscriptionById } from "../Transcription/Transcription.controller.js";

const router = express.Router();

// protected route
router.post("/transcriptions", createTranscription);
router.get("/transcriptions/getAll", getAllTranscriptions);
router.get("/getTrancriptionById/:id", getTranscriptionById);
router.get("/DeleteTrancriptionById/:id", deleteTranscription);

export default router;   