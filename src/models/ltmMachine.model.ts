import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema(
    {
        timestamp: {
            type: String
        },
        "Date time": {
            type: String,
        },
        Asset_Code: {
            type: String
        },
        Engine_Number: {
            type: String
        },
        Leak: {
            type: String,
        },
        Pressure: {
            type: String
        },
        Status: {
            type: String,
        },
        CT: {
            type: String
        },
        Asset_Status: {
            type: String
        },
    });

export const LTMMachine = mongoose.model('LTMMachine', machineSchema, 'LTMMachine');

