import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
        },
        userId: {
            type: String,
        },
        isactive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);

export const Token = mongoose.model('tokens', tokenSchema, 'tokens');

