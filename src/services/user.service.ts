import { CONSTANT_MSG } from "../common/constant_message";
import { User } from '../models/users.model';
import bcrypt from "bcryptjs";
import { getJwtToken } from "../middleware/authendication";
import { ObjectId } from 'mongodb';
import CSVtoJSON from 'csvtojson'
import ExcelJS from 'exceljs';
import { RejectReason } from "../models/rejectReasons.model";

const userLogin = async (reqBody: any) => {
    try {
        let userDetails: any = await User.findOne({ username: reqBody.username });
        if (!userDetails) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: CONSTANT_MSG.USER.USER_NOT_REGISTED
            };
        }
        if (!userDetails || !(await bcrypt.compare(reqBody.password, userDetails.password))) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: CONSTANT_MSG.USER.INCORRECT_USERNAME_OR_PASSWORD,
            };
        }
        userDetails = userDetails.toObject();
        delete userDetails.password;
        const token = await getJwtToken(userDetails);
        userDetails.access_token = token;
        userDetails.refresh_token = token;
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS, status: CONSTANT_MSG.STATUS.SUCCESS, message: CONSTANT_MSG.USER.LOGIN_SUCCESSFULLY, data: userDetails
        }
    } catch (error: any) {
        return { statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message };
    }
};

const userLogout = async (reqBody: any) => {
    try {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS, status: CONSTANT_MSG.STATUS.SUCCESS, message: CONSTANT_MSG.USER.LOGOUT_SUCCESSFULLY
        }
    } catch (error: any) {
        return { statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message };
    }
};

const userDetails = async (reqBody: any) => {
    try {
        let userDetails: any = await User.findOne({ _id: new ObjectId(reqBody.user.userId) });
        if (!userDetails) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: CONSTANT_MSG.USER.USER_NOT_REGISTED
            };
        }
        userDetails = userDetails.toObject();
        delete userDetails.password;
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS, status: CONSTANT_MSG.STATUS.SUCCESS, message: CONSTANT_MSG.USER.USER_FETCHED, data: userDetails
        }
    } catch (error: any) {
        return { statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message };
    }
};


const addUser = async (reqBody: any) => {
    try {
        const userCheck = await User.findOne({ username: reqBody.username })
        if (userCheck) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: "User already exists",
            };
        }
        const hashedpassword = reqBody.password ? await bcrypt.hash(reqBody.password, 5) : '';
        reqBody.password = hashedpassword;
        const userDetails = new User(reqBody);
        await userDetails.save();
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "User added successfully",
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

const getUser = async (reqBody: any) => {
    try {
        if (reqBody.limit) {
            const page = reqBody.page;
            const limit = reqBody.limit;
            const skip = (page - 1) * limit;
            const filter: any = {};
            let sort: any = { "createdAt": -1 };
            if (reqBody.sortBy) {
                sort = { [reqBody.sortBy]: reqBody.sortDesc };
            }
            if (reqBody.search && reqBody.search !== '') {
                filter['$or'] = [{ name: { $regex: reqBody.search, $options: 'i' } },
                { roles: { $regex: reqBody.search, $options: 'i' } },
                { username: { $regex: reqBody.search, $options: 'i' } }]
            }
            if (reqBody.roles && reqBody.roles.length) {
                filter['role'] = { $in: reqBody.roles }
            }
            const userList: any = await User.find(filter, { password: 0, updatesAt: 0, __v: 0 }).sort(sort).skip(skip).limit(limit);
            const totalUser = await User.find(filter).count();
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: "Users fethed successfully",
                data: {
                    userList: userList,
                    totalUser: totalUser
                }
            };
        } else {
            const userList: any = await User.find({ role: 'Picker' }, { name: 1 });
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: "Users fethed successfully",
                data: userList
            };
        }
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

const updateUser = async (userId: string, reqBody: any) => {
    try {
        const userCheck = await User.findOne({ _id: new ObjectId(userId) });
        if (!userCheck) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: "User not found",
            };
        }
        const userDetails = await User.findOne({ username: reqBody.username, _id: { $ne: new ObjectId(userId) } })
        if (userDetails) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: "User already exists",
            };
        }
        await User.updateOne({ _id: new ObjectId(userId) }, reqBody);
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "User updates successfully",
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

const deleteUser = async (userId: string) => {
    try {
        const userDetails = await User.findOne({ _id: new ObjectId(userId) });
        if (!userDetails) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: "User not found",
            };
        }
        await User.deleteOne({ _id: new ObjectId(userId) });
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "User removed successfully",
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};


export const createAdminOnStartUp = async () => {
    try {
        let userObj: any = {
            name: "DatACT Admin",
            username: "admin@datact.com",
            password: "admin@1234",
            role: CONSTANT_MSG.ROLE.ADMIN
        };
        const userDetails = await User.findOne({ username: userObj.username });
        if (!userDetails) {
            const hashedpassword = userObj.password ? await bcrypt.hash(userObj.password, 5) : '';
            userObj.password = hashedpassword;
            userObj = new User(userObj);
            await userObj.save();
        }
        return true;
    } catch (error: any) {
        console.log("CreateUserOnStartUp", error.message);
        return true;
    }
}

const uploadCSVData = async (collection: string, req: any) => {
    try {
        let convertData: any = await fileConvertion(req);
        if (convertData && convertData.status === CONSTANT_MSG.STATUS.ERROR) {
            return convertData;
        } else {
            if (collection === 'MACHEINE') {
                convertData.data = normalizeKeys(convertData.data);
            }
            const checkValidate: any = checkFieldsValidation(convertData.data, collection)
            if (!checkValidate) {
                return {
                    statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                    status: CONSTANT_MSG.STATUS.ERROR,
                    message: 'CSV File InValid Format',
                };
            } else {
                const response = await uploadData(convertData.data, collection);
                return response;
            }
        }
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
}

const normalizeKeys = (data) => {
    return data.map(obj => {
        const newObj = {}
        Object.keys(obj).forEach(key => {
            const camelKey = key
                .replace(/\s*\/\s*/g, ' ')
                .replace(/\s+/g, ' ')
                .split(' ')
                .map((word, i) =>
                    i === 0
                        ? word.toLowerCase()
                        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join('')
            newObj[camelKey] = obj[key]
        })
        return newObj
    })
}

const fileConvertion = async (req: any) => {
    try {
        if ((req.files && req.files.length > 0)) {
            if (req.files[0].mimetype != 'text/csv') {
                return {
                    statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                    status: CONSTANT_MSG.STATUS.ERROR,
                    message: 'only .csv file is supported',
                };
            } else if (req.files[0].size > 1000000 * 100) {
                return {
                    statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                    status: CONSTANT_MSG.STATUS.ERROR,
                    message: 'file size is too large.',
                };
            } else {
                const csvfile = req.files[0].buffer;
                const toString = csvfile.toString();
                const convertedData = await CSVtoJSON().fromString(toString);
                if (!convertedData || !convertedData.length) {
                    return {
                        statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                        status: CONSTANT_MSG.STATUS.ERROR,
                        message: 'Invalid data',
                    };
                } else {
                    return {
                        statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
                        status: CONSTANT_MSG.STATUS.SUCCESS,
                        message: 'Added complete',
                        data: convertedData
                    };
                }
            }
        } else {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: 'CSV File InValid Format',
            };
        }
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
}

const checkFieldsValidation = (csvRecords: any, collectionName: string) => {
    try {
        let op = 1;
        for (let i = 0; i < CONSTANT_MSG.CSV_FIELDS[collectionName].length; i++) {
            if (!csvRecords[0].hasOwnProperty(CONSTANT_MSG.CSV_FIELDS[collectionName][i])) {
                op = 0;
            }
        }
        return op;
    } catch (error: any) {
        console.log('checkFieldsValidation', error.message)
        return 0;
    }
}

const uploadData = async (csvRecords: any, collectionName: string) => {
    try {
        if (csvRecords && !csvRecords.length) {
            return {
                statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: 'Missing collection name || new record',
            };
        }
        for (const record of csvRecords) {
            const document = JSON.parse(JSON.stringify(record));
            if (collectionName === 'USER') {
                const hashedpassword = document.password ? await bcrypt.hash(document.password, 5) : '';
                document.role = CONSTANT_MSG.ROLES.includes(document.role) ? document.role : CONSTANT_MSG.ROLES[2];
                document.password = hashedpassword;
                if (document.username && document.username !== "") {
                    const user = await User.findOne({ username: document.username });
                    if (!user) {
                        await User.create(document);
                    }
                }
            } else if (collectionName === 'REJECTREASON') {
                if (document.reasonCode !== "" && document.reason !== "") {
                    const rejectReason = await RejectReason.findOne({ reason: document.reason });
                    if (!rejectReason) {
                        await RejectReason.create(document);
                    }
                }
            }
        }
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: 'DATA ADD SUCCESSFULL',
        };
    } catch (error) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: 'FAILED TO ADD DATA',
        };
    }
}

const downloadReport = async (reportType: string, reqBody: any) => {
    try {
        let reportData = {};
        const filter: any = {};
        if (reportType === "Users") {
            if (reqBody.search && reqBody.search !== '') {
                filter['$or'] = [{ name: { $regex: reqBody.search, $options: 'i' } },
                { roles: { $regex: reqBody.search, $options: 'i' } },
                { username: { $regex: reqBody.search, $options: 'i' } }]
            }
            if (reqBody.roles && reqBody.roles.length) {
                filter['role'] = { $in: reqBody.roles }
            }
            const user = await User.aggregate([
                { $match: filter },
                { $sort: { createdAt: -1 } },
                {
                    $project: {
                        "_id": 0,
                        "Name": "$name",
                        "Employee Id": "$username",
                        "Roles": "$role",
                    }
                }
            ]);
            reportData = await excelReportConvertion(reportType, user);
        }

        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: 'DATA FETCHED SUCCESSFULL',
            data: reportData
        };
    } catch (error: any) {
        return {
            statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
}

const excelReportConvertion = async (reportType: string, reqData: any) => {
    try {
        if (reportType !== 'Trace') {
            const workbook: any = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(reportType);
            const stationKeys = Object.keys(reqData[0]);
            const startingRowIndex = worksheet.rowCount;
            worksheet.getCell(`A${startingRowIndex}`).alignment = { horizontal: 'center' };
            worksheet.addRow(stationKeys);
            const row = worksheet.getRow(worksheet.rowCount);
            row.eachCell((cell) => {
                cell.font = {
                    color: { argb: '00000000' },
                    bold: true,
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '00bfbfbf' }
                };
            });

            reqData.forEach((stat: any) => {
                const rowData: any = [];
                Object.keys(stat).forEach((key: any) => {
                    stat[key] = typeof stat[key] === "object" ? stat[key].toString() : stat[key];
                    rowData.push(stat[key]);
                });
                worksheet.addRow(rowData);
            });

            const fileBuffer: any = await workbook.xlsx.writeBuffer();
            return fileBuffer;
        } else {
            const workbook: any = new ExcelJS.Workbook();

            const addSheetWithData = (sheetName: string, data: any[]) => {
                if (data.length === 0) return;

                const worksheet = workbook.addWorksheet(sheetName);
                const headers = Object.keys(data[0]);

                const startingRowIndex = worksheet.rowCount;
                worksheet.getCell(`A${startingRowIndex}`).alignment = { horizontal: 'center' };
                worksheet.addRow(headers);

                const row = worksheet.getRow(worksheet.rowCount);
                row.eachCell((cell) => {
                    cell.font = { color: { argb: '00000000' }, bold: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00bfbfbf' } };
                });

                data.forEach((item: any) => {
                    const rowData = headers.map((key) =>
                        typeof item[key] === "object" ? item[key]?.toString() : item[key]
                    );
                    worksheet.addRow(rowData);
                });
            };

            addSheetWithData("Station", reqData.stationData);
            if (reqData.inspectionData && reqData.inspectionData.length) {
                addSheetWithData("Inspection Report", reqData.inspectionData);
            }
            if (reqData.mappingData && reqData.mappingData.length) {
                addSheetWithData("Mapping", reqData.mappingData);
            }

            const fileBuffer: any = await workbook.xlsx.writeBuffer();
            return fileBuffer;
        }
    } catch (error: any) {
        console.log("excelReportConvertion", error)
        return "";
    }
}

export default {
    userLogin,
    userLogout,
    userDetails,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    uploadCSVData,
    downloadReport
}