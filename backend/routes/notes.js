import express from "express";
import crypto from "node:crypto";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const owns = (note, user) => note && note.createdBy.toString() === user._id.toString();
const cleanTags = (tags) => Array.isArray(tags) ? [...new Set(tags.map(t => String(t).trim()).filter(Boolean))].slice(0, 12) : [];

// Public, read-only shared note. Keep this before the protected routes.
router.get("/shared/:token", async (req, res) => {
  try {
    const note = await Note.findOne({ shareToken: req.params.token, shareEnabled: true, deletedAt: null }).select("title description category tags updatedAt");
    if (!note) return res.status(404).json({ message: "This shared note is unavailable." });
    res.json(note);
  } catch { res.status(500).json({ message: "Unable to load shared note." }); }
});

router.use(protect);

// List active notes, archived notes, or recycle-bin notes.
router.get("/", async (req, res) => {
  try {
    const filter = { createdBy: req.user._id };
    if (req.query.bin === "true") filter.deletedAt = { $ne: null };
    else {
      filter.deletedAt = null;
      // The client filters archived notes into their own workspace section.
    }
    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) { console.error(err); res.status(500).json({ message: "Unable to load notes." }); }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    if (!title?.trim() || !description?.trim()) return res.status(400).json({ message: "Title and note content are required." });
    const note = await Note.create({ title: title.trim(), description, category: category || "General", tags: cleanTags(tags), createdBy: req.user._id });
    res.status(201).json(note);
  } catch (err) { console.error(err); res.status(500).json({ message: "Unable to create note." }); }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!owns(note, req.user)) return res.status(note ? 403 : 404).json({ message: note ? "Not authorized." : "Note not found." });
    res.json(note);
  } catch { res.status(400).json({ message: "Invalid note ID." }); }
});

router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!owns(note, req.user)) return res.status(note ? 403 : 404).json({ message: note ? "Not authorized." : "Note not found." });
    const { title, description, category, tags, isFavorite, isArchived } = req.body;
    if (title !== undefined) note.title = String(title).trim();
    if (description !== undefined) note.description = String(description);
    if (category !== undefined) note.category = String(category).trim() || "General";
    if (tags !== undefined) note.tags = cleanTags(tags);
    if (isFavorite !== undefined) note.isFavorite = Boolean(isFavorite);
    if (isArchived !== undefined) note.isArchived = Boolean(isArchived);
    await note.save();
    res.json(note);
  } catch (err) { console.error(err); res.status(400).json({ message: "Unable to update note." }); }
});

// Move to recycle bin (soft delete).
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!owns(note, req.user)) return res.status(note ? 403 : 404).json({ message: note ? "Not authorized." : "Note not found." });
    note.deletedAt = new Date();
    note.shareEnabled = false;
    await note.save();
    res.json({ message: "Note moved to recycle bin." });
  } catch { res.status(400).json({ message: "Unable to move note to recycle bin." }); }
});

router.post("/:id/restore", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!owns(note, req.user)) return res.status(note ? 403 : 404).json({ message: note ? "Not authorized." : "Note not found." });
    note.deletedAt = null; note.isArchived = false; await note.save();
    res.json(note);
  } catch { res.status(400).json({ message: "Unable to restore note." }); }
});

router.delete("/:id/permanent", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!owns(note, req.user)) return res.status(note ? 403 : 404).json({ message: note ? "Not authorized." : "Note not found." });
    await note.deleteOne(); res.json({ message: "Note permanently deleted." });
  } catch { res.status(400).json({ message: "Unable to permanently delete note." }); }
});

router.post("/:id/share", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!owns(note, req.user)) return res.status(note ? 403 : 404).json({ message: note ? "Not authorized." : "Note not found." });
    if (!note.shareToken) note.shareToken = crypto.randomBytes(24).toString("hex");
    note.shareEnabled = true; await note.save();
    res.json({ shareToken: note.shareToken, shareEnabled: true });
  } catch { res.status(400).json({ message: "Unable to create share link." }); }
});

router.delete("/:id/share", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!owns(note, req.user)) return res.status(note ? 403 : 404).json({ message: note ? "Not authorized." : "Note not found." });
    note.shareEnabled = false; await note.save();
    res.json({ message: "Sharing disabled." });
  } catch { res.status(400).json({ message: "Unable to disable sharing." }); }
});

export default router;
