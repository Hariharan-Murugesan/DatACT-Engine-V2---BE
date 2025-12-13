import mongoose from 'mongoose';

const ltmSpecificationSchema = new mongoose.Schema(
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
        Engine_Model: {
            type: String
        },
        Leak_LSL: {
            type: String,
        },
        Leak_USL: {
            type: String
        },
        Pressure_LSL: {
            type: String,
        },
        Pressure_USL: {
            type: String
        }
    });

export const LTMSpecification = mongoose.model('LTMSpecification', ltmSpecificationSchema, 'LTMSpecification');

