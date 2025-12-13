import { CONSTANT_MSG } from "../common/constant_message";
import { RejectReason } from "../models/rejectReasons.model";
import { ObjectId } from 'mongodb';

const addRejectReason = async (reqBody: any) => {
    try {
        const rejectReason = new RejectReason(reqBody);
        await rejectReason.save();
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "RejectReason added successfully",
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

const getRejectReason = async (reqBody: any) => {
    try {
        const page = reqBody.page;
        const limit = reqBody.limit;
        const skip = (page - 1) * limit;
        const filter: any = {};
        let sort: any = { "createdAt": -1 };
        if (reqBody.sortBy) {
            sort = { [reqBody.sortBy]: reqBody.sortDesc };
        }
        if (reqBody.search && reqBody.search !== '') {
            filter['$or'] = [{ reasonCode: { $regex: reqBody.search, $options: 'i' } },
            { reason: { $regex: reqBody.search, $options: 'i' } },]
        }
        const rejectReason = await RejectReason.find(filter, { updatesAt: 0, __v: 0 }).sort(sort).skip(skip).limit(limit);
        const rejectReasonTotal = await RejectReason.find(filter).count();
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "RejectReason fethed successfully",
            data: {
                rejectReason: rejectReason,
                totalRejectReason: rejectReasonTotal
            }
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

const updateRejectReason = async (rejectReasonId: string, reqBody: any) => {
    try {
        const reason = await RejectReason.findOne({ _id: new ObjectId(rejectReasonId) });
        if (!reason) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: "RejectReason not found",
            };
        }
        await RejectReason.updateOne({ _id: new ObjectId(rejectReasonId) }, reqBody);
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "RejectReason updates successfully",
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

const deleteRejectReason = async (rejectReasonId: string) => {
    try {
        const reason = await RejectReason.findOne({ _id: new ObjectId(rejectReasonId) });
        if (!reason) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: "RejectReason not found",
            };
        }
        await RejectReason.deleteOne({ _id: new ObjectId(rejectReasonId) });
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "RejectReason removed successfully",
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

const getRejectReasonList = async (reqBody: any) => {
    try {
        const reasonList = await RejectReason.aggregate([
            {
                $project: {
                    _id: 1,
                    reason: 1,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    reason: { $first: "$reason" }
                }
            }
        ]);
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "Reject Reason fethed successfully",
            data: reasonList
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

export default {
    addRejectReason,
    getRejectReason,
    updateRejectReason,
    deleteRejectReason,
    getRejectReasonList,
};