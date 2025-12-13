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
            type: String,
        },
        Torque_1: {
            type: String
        },
        Angle_1: {
            type: String,
        },
        Status_1: {
            type: String
        },
        Torque_2: {
            type: String
        },
        Angle_2: {
            type: String,
        },
        Status_2: {
            type: String
        },
        Torque_3: {
            type: String
        },
        Angle_3: {
            type: String,
        },
        Status_3: {
            type: String
        },
        Torque_4: {
            type: String
        },
        Angle_4: {
            type: String,
        },
        Status_4: {
            type: String
        },
        CT: {
            type: String
        },
        Asset_Status: {
            type: String
        },
    });

export const DCMachine = mongoose.model('DCMachine', machineSchema, 'DCMachine');

