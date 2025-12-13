import mongoose from 'mongoose';

const rejectReasonSchema = new mongoose.Schema(
    {
        reasonCode: { type: String },
        reason: { type: String }
    },
    {
        timestamps: true,
    });

export const RejectReason = mongoose.model('rejectReasons', rejectReasonSchema, 'rejectReasons');