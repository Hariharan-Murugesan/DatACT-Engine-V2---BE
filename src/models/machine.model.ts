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
        Asset_Type: {
            type: String,
        },
        Asset_Name: {
            type: String
        },
        Asset_Make: {
            type: String,
        },
        Asset_Model: {
            type: String
        },
        Spindle_Count: {
            type: String
        },
        Line: {
            type: String,
        },
    });

export const Machine = mongoose.model('Machine', machineSchema, 'Machine');

