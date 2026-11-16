import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true },
  category: { type: String, default: "General", trim: true },
  tags: [{ type: String, trim: true }],
  isFavorite: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  shareToken: { type: String, default: null, index: true },
  shareEnabled: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

noteSchema.index({ createdBy: 1, deletedAt: 1, updatedAt: -1 });
export default mongoose.model("Note", noteSchema);
