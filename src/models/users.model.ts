import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        username: { type: String },
        password: { type: String },
        role: { type: String }
    },
    {
        timestamps: true,
    });

export const User = mongoose.model('users', userSchema, 'users');