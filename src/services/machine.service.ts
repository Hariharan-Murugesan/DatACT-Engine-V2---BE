import { DCMachine } from "../models/dcMachine.model";
import { LTMMachine } from "../models/ltmMachine.model";
import { Machine } from "../models/machine.model";
import { CONSTANT_MSG } from "../common/constant_message";
import ExcelJS from "exceljs";
import moment from "moment";
import { ObjectId } from "mongodb";
import { DCSpecification } from "../models/dcSpecification.model";
import { LTMSpecification } from "../models/ltmSpecification.model";

const machineList = async () => {
  try {
    const dcMachine = await DCMachine.aggregate([
      {
        $group: {
          _id: "$Asset_Code",
          latestEntry: {
            $max: {
              timestamp: "$timestamp",
              document: "$$ROOT"
            }
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$latestEntry.document" }
      },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $project: { _id: 0, Asset_Name: 1, Line: 1 } }],
          as: "assetDetails"
        }
      },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: "DCSpecification",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $project: { _id: 0, Engine_Model: 1 } }],
          as: "model"
        }
      },
      {
        $unwind: { path: "$model", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 0, timestamp: 1, Asset_Status: 1, Engine_Number: 1, Asset_Code: 1, Status_1: 1, Status_2: 1, Status_3: 1, Status_4: 1,
          Torque_1: 1, Torque_2: 1, Torque_3: 1, Torque_4: 1, CT: 1, Angle_1: 1, Angle_2: 1, Angle_3: 1, Angle_4: 1, assetDetails: 1,
          model: "$model.Engine_Model"
        }
      },
      {
        $sort: { Asset_Code: 1 }
      }
    ]);
    const ltmMachine = await LTMMachine.aggregate([
      {
        $group: {
          _id: "$Asset_Code",
          latestEntry: {
            $max: {
              timestamp: "$timestamp",
              document: "$$ROOT"
            }
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$latestEntry.document" }
      },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $project: { _id: 0, Asset_Name: 1, Line: 1 } }],
          as: "assetDetails"
        }
      },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: "LTMSpecification",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $project: { _id: 0, Engine_Model: 1 } }],
          as: "model"
        }
      },
      {
        $unwind: { path: "$model", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 0, timestamp: 1, Asset_Status: 1, Engine_Number: 1, Asset_Code: 1, Status: 1, CT: 1, Leak: 1,
          Pressure: 1, assetDetails: 1, model: "$model.Engine_Model"
        }
      },
      {
        $sort: { Asset_Code: 1 }
      }
    ]);
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
      data: {
        dcMachine: dcMachine,
        ltmMachine: ltmMachine,
      },
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const machineListDetails = async (reqBody: any) => {
  try {
    const datt = ["", "DC Nutrunners", "LTM", "DC Nutrunners & LTM"];
    let dcMachine: any = [], dcMachineTotal: any = 0;
    let ltmMachine: any = [], ltmMachineTotal: any = 0;
    let filterArr: any = [];
    let assetFilterArr: any = {};
    let specificationFilterArr: any = {};
    const dcMachineSkip: any = (reqBody.dcMachinePage - 1) * reqBody.dcMachineLimit;
    const dcMachineLimit: any = reqBody.dcMachineLimit;
    const ltmMachineSkip: any = (reqBody.ltmMachinePage - 1) * reqBody.ltmMachineLimit;
    const ltmMachineLimit: any = reqBody.ltmMachineLimit;
    if (reqBody.selectedStatus !== "") {
      filterArr.push({ Asset_Status: reqBody.selectedStatus === "OK" ? "0" : "1" });
    }
    if (reqBody.selectedModel !== "") {
      specificationFilterArr.Engine_Model = reqBody.selectedModel;

    }
    if (reqBody.searchValue !== "") {
      filterArr.push({ Engine_Number: reqBody.searchValue });
    }
    if (!datt.includes(reqBody.selectedItem)) {
      assetFilterArr.Asset_Name = reqBody.selectedItem;
    }
    if (reqBody.startDate && reqBody.startDate !== "") {
      let startDate = moment(reqBody.startDate, "YYYY-MM-DD").startOf('day').unix();
      filterArr.push({ timestamp: { $gte: startDate.toString() } });
    }
    if (reqBody.endDate && reqBody.endDate !== "") {
      let endDate = moment(reqBody.endDate, "YYYY-MM-DD").endOf('day').unix();
      filterArr.push({ timestamp: { $lte: endDate.toString() } });
    }
    filterArr = filterArr.length ? { $and: filterArr } : {};

    dcMachine = await DCMachine.aggregate([
      { $match: filterArr },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $lookup: {
          from: "DCSpecification",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: specificationFilterArr }],
          as: "specificationDetails",
        },
      },
      {
        $match: { specificationDetails: { $ne: [] } },
      },
      // {
      //   $sort: { "Date time": -1 },
      // },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          "S No": "$Engine_Number",
          "Engine Number": "$Engine_Number",
          "Date": "$Date time",
          "Time": "$Date time",
          "Station Name": "$assetDetails.Asset_Name",
          "Torque 1 (Nm)": { $ifNull: ["$Torque_1", "-"] },
          "Angle 1 (Deg)": { $ifNull: ["$Angle_1", "-"] },
          "Status 1": { $ifNull: ["$Status_1", "-"] },
          "Torque 2 (Nm)": { $ifNull: ["$Torque_2", "-"] },
          "Angle 2 (Deg)": { $ifNull: ["$Angle_2", "-"] },
          "Status 2": { $ifNull: ["$Status_2", "-"] },
          "Torque 3 (Nm)": { $ifNull: ["$Torque_3", "-"] },
          "Angle 3 (Deg)": { $ifNull: ["$Angle_3", "-"] },
          "Status 3": { $ifNull: ["$Status_3", "-"] },
          "Torque 4 (Nm)": { $ifNull: ["$Torque_4", "-"] },
          "Angle 4 (Deg)": { $ifNull: ["$Angle_4", "-"] },
          "Status 4": { $ifNull: ["$Status_4", "-"] }
        },
      }, {
        $skip: dcMachineSkip
      },
      {
        $limit: dcMachineLimit
      }
    ]);
    dcMachineTotal = (await DCMachine.aggregate([
      { $match: filterArr },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $lookup: {
          from: "DCSpecification",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: specificationFilterArr }],
          as: "specificationDetails",
        },
      },
      {
        $match: { specificationDetails: { $ne: [] } },
      },
      {
        $project: {
          _id: 1,
        },
      }
    ])).length

    ltmMachine = await LTMMachine.aggregate([
      { $match: filterArr },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $lookup: {
          from: "LTMSpecification",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: specificationFilterArr }],
          as: "specificationDetails",
        },
      },
      {
        $match: { specificationDetails: { $ne: [] } },
      },
      // {
      //   $sort: { "Date time": -1 },
      // },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          "S No": "$Engine_Number",
          "Engine Number": "$Engine_Number",
          "Date": "$Date time",
          "Time": "$Date time",
          "Station Name": "$assetDetails.Asset_Name",
          "Leak (Pa)": "$Leak",
          "Pressure (KPa)": "$Pressure",
          "Status": "$Status"
        },
      }, {
        $skip: ltmMachineSkip
      },
      {
        $limit: ltmMachineLimit
      }
    ]);
    ltmMachineTotal = (await LTMMachine.aggregate([
      { $match: filterArr },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $lookup: {
          from: "LTMSpecification",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: specificationFilterArr }],
          as: "specificationDetails",
        },
      },
      {
        $match: { specificationDetails: { $ne: [] } },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ])).length;
    for (const [index, dc] of dcMachine.entries()) {
      const dateTime = moment(new Date(dc['Date']))
      dc['S No'] = dcMachineSkip + index + 1;
      dc['Date'] = dateTime.format('YYYY-MM-DD');
      dc['Time'] = dateTime.format('HH:mm a');
    }
    for (const [index, ltm] of ltmMachine.entries()) {
      const dateTime = moment(new Date(ltm['Date']));
      ltm['S No'] = ltmMachineSkip + index + 1;
      ltm['Date'] = dateTime.format('YYYY-MM-DD');
      ltm['Time'] = dateTime.format('HH:mm a');
    }
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
      data: {
        dcMachine: dcMachine,
        ltmMachine: ltmMachine,
        dcMachineTotal,
        ltmMachineTotal
      },
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const machineDropList = async (reqBody: any) => {
  try {
    let machine = await Machine.find({}, { Asset_Name: 1 }).sort({
      Asset_Type: 1,
    });
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
      data: machine,
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const reportDownload = async (reqBody: any) => {
  try {
    const datt = ["", "DC Nutrunners", "LTM", "DC Nutrunners & LTM"];
    let dcMachine: any = [], report: any = 0;
    let ltmMachine: any = [];
    let filterArr: any = [];
    let assetFilterArr: any = {};
    let specificationFilterArr: any = {};
    if (reqBody.selectedStatus !== "") {
      filterArr.push({ Asset_Status: reqBody.selectedStatus === "OK" ? "0" : "1" });
    }
    if (reqBody.selectedModel !== "") {
      specificationFilterArr.Engine_Model = reqBody.selectedModel;

    }
    if (reqBody.searchValue !== "") {
      filterArr.push({ Engine_Number: reqBody.searchValue });
    }
    if (!datt.includes(reqBody.selectedItem)) {
      assetFilterArr.Asset_Name = reqBody.selectedItem;
    }
    if (reqBody.startDate && reqBody.startDate !== "") {
      let startDate = moment(reqBody.startDate, "YYYY-MM-DD").startOf('day').unix();
      filterArr.push({ timestamp: { $gte: startDate.toString() } });
    }
    if (reqBody.endDate && reqBody.endDate !== "") {
      let endDate = moment(reqBody.endDate, "YYYY-MM-DD").endOf('day').unix();
      filterArr.push({ timestamp: { $lte: endDate.toString() } });
    }
    filterArr = filterArr.length ? { $and: filterArr } : {};

    dcMachine = await DCMachine.aggregate([
      { $match: filterArr },
      // {
      //   $sort: { Asset_Code: 1, "Date time": -1 },
      // },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          "S No": "$Engine_Number",
          "Engine Number": "$Engine_Number",
          "Date": "$Date time",
          "Time": "$Date time",
          "Station Name": { $ifNull: ["$assetDetails.Asset_Name", "-"] },
          "Torque 1 (Nm)": { $ifNull: ["$Torque_1", "-"] },
          "Angle 1 (Deg)": { $ifNull: ["$Angle_1", "-"] },
          "Status 1": { $ifNull: ["$Status_1", "-"] },
          "Torque 2 (Nm)": { $ifNull: ["$Torque_2", "-"] },
          "Angle 2 (Deg)": { $ifNull: ["$Angle_2", "-"] },
          "Status 2": { $ifNull: ["$Status_2", "-"] },
          "Torque 3 (Nm)": { $ifNull: ["$Torque_3", "-"] },
          "Angle 3 (Deg)": { $ifNull: ["$Angle_3", "-"] },
          "Status 3": { $ifNull: ["$Status_3", "-"] },
          "Torque 4 (Nm)": { $ifNull: ["$Torque_4", "-"] },
          "Angle 4 (Deg)": { $ifNull: ["$Angle_4", "-"] },
          "Status 4": { $ifNull: ["$Status_4", "-"] }
        },
      },
    ]);
    ltmMachine = await LTMMachine.aggregate([
      { $match: filterArr },
      // {
      //   $sort: { Asset_Code: 1, "Date time": -1 },
      // },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          "S No": "$Engine_Number",
          "Engine Number": "$Engine_Number",
          "Date": "$Date time",
          "Time": "$Date time",
          "Station Name": "$assetDetails.Asset_Name",
          "Leak (Pa)": "$Leak",
          "Pressure (KPa)": "$Pressure",
          "Status": "$Status"
        },
      },
    ]);
    for (const [index, dc] of dcMachine.entries()) {
      const dateTime = moment(new Date(dc['Date']))
      dc['S No'] = index + 1;
      dc['Date'] = dateTime.format('YYYY-MM-DD');
      dc['Time'] = dateTime.format('HH:mm a');
    }
    for (const [index, ltm] of ltmMachine.entries()) {
      const dateTime = moment(new Date(ltm['Date']));
      ltm['S No'] = index + 1;
      ltm['Date'] = dateTime.format('YYYY-MM-DD');
      ltm['Time'] = dateTime.format('HH:mm a');
    }
    report = await reportConvertion(dcMachine, ltmMachine);
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
      tabledata: report,
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const specificationDropList = async (reqBody: any) => {
  try {
    let dcSpecification = await DCSpecification.aggregate([
      { $group: { _id: "$Engine_Model" } },
      { $sort: { _id: 1 } },
      { $project: { Engine_Model: "$_id", _id: 0 } }
    ])
    let ltmSpecification = await LTMSpecification.aggregate([
      { $group: { _id: "$Engine_Model" } },
      { $sort: { _id: 1 } },
      { $project: { Engine_Model: "$_id", _id: 0 } }
    ])
    let data: any = [...dcSpecification, ...ltmSpecification];
    data = data.filter((item, index, array) => {
      const currentIndex: any = array.findIndex(i => i.Engine_Model === item.Engine_Model);
      return currentIndex === index;
    });

    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
      data: data,
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const specificationListDetails = async (reqBody: any) => {
  try {
    let dcSpecification: any = [];
    let ltmSpecification: any = [];
    let filterArr: any = {};
    let assetFilterArr: any = {};
    // if (reqBody.searchValue !== "") {
    //   filterArr.Engine_Model = reqBody.searchValue;
    // }
    if (reqBody.selectedItem !== "") {
      filterArr.Engine_Model = reqBody.selectedItem;
    }
    dcSpecification = await DCSpecification.aggregate([
      { $match: filterArr },
      {
        $sort: { Asset_Code: 1, "Date time": -1 },
      },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          "Station Name": "$assetDetails.Asset_Name",
          "Model": "$Engine_Model",
          "Torque 1 LSL (Nm)": { $ifNull: ["$Torque1_LSL", "-"] },
          "Torque 1 USL (Nm)": { $ifNull: ["$Torque1_USL", "-"] },
          "Torque 2 LSL (Nm)": { $ifNull: ["$Torque2_LSL", "-"] },
          "Torque 2 USL (Nm)": { $ifNull: ["$Torque2_USL", "-"] },
          "Torque 3 LSL (Nm)": { $ifNull: ["$Torque3_LSL", "-"] },
          "Torque 3 USL (Nm)": { $ifNull: ["$Torque3_USL", "-"] },
          "Torque 4 LSL (Nm)": { $ifNull: ["$Torque4_LSL", "-"] },
          "Torque 4 USL (Nm)": { $ifNull: ["$Torque4_USL", "-"] }
        },
      },
    ]);
    ltmSpecification = await LTMSpecification.aggregate([
      { $match: filterArr },
      {
        $sort: { Asset_Code: 1, "Date time": -1 },
      },
      {
        $lookup: {
          from: "Machine",
          localField: "Asset_Code",
          foreignField: "Asset_Code",
          pipeline: [{ $match: assetFilterArr }],
          as: "assetDetails",
        },
      },
      {
        $match: { assetDetails: { $ne: [] } },
      },
      {
        $unwind: { path: "$assetDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          "Station Name": "$assetDetails.Asset_Name",
          "Model": "$Engine_Model",
          "Leak Value LSL (Pa)": { $ifNull: ["$Leak_LSL", "-"] },
          "Leak Value USL (KPa)": { $ifNull: ["$Leak_USL", "-"] },
          "Pressure Value LSL (Pa)": { $ifNull: ["$Pressure_LSL", "-"] },
          "Pressure Value USL (KPa)": { $ifNull: ["$Pressure_USL", "-"] }
        },
      },
    ]);
    const dcSpecificationOp: any = [], ltmSpecificationOp: any = [];
    for (const dc of dcSpecification) {
      dcSpecificationOp.push({
        "Station Name": dc["Station Name"],
        "Model": dc["Model"],
        "Torque 1 Limit (Nm)": range(dc["Torque 1 LSL (Nm)"], dc["Torque 1 USL (Nm)"]),
        "Torque 2 Limit (Nm)": range(dc["Torque 2 LSL (Nm)"], dc["Torque 2 USL (Nm)"]),
        "Torque 3 Limit (Nm)": range(dc["Torque 3 LSL (Nm)"], dc["Torque 3 USL (Nm)"]),
        "Torque 4 Limit (Nm)": range(dc["Torque 4 LSL (Nm)"], dc["Torque 4 USL (Nm)"]),
      });
    }
    for (const dc of ltmSpecification) {
      ltmSpecificationOp.push({
        "Station Name": dc["Station Name"],
        "Model": dc["Model"],
        "Leak Value Limit (Pa)": range(dc["Leak Value LSL (Pa)"], dc["Leak Value USL (KPa)"]),
        "Pressure Value 1 Limit (Pa)": range(dc["Pressure Value LSL (Pa)"], dc["Pressure Value USL (KPa)"]),
      });
    }
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
      data: {
        dcSpecification: dcSpecificationOp,
        ltmSpecification: ltmSpecificationOp
      },
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const range = (lsl: any, usl: any) => {
  if (lsl === "-" && usl === "-") return "-";
  return `${lsl} - ${usl}`;
};

const allMachineList = async (reqBody: any) => {
  try {
    const dcMachine = await DCMachine.find(
      {},
    );
    const ltmMachine = await LTMMachine.find(
      {},
    );
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
      data: {
        dcMachine: dcMachine,
        ltmMachine: ltmMachine,
      },
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const updateMachineDetails = async (reqBody: any) => {
  try {
    for (const machine of reqBody.dcMachine) {
      const data = {};
      await DCMachine.updateOne({ _id: new ObjectId(machine._id) }, data);
    }
    for (const machine of reqBody.ltmMachine) {
      const data = {};
      await LTMMachine.updateOne({ _id: new ObjectId(machine._id) }, data);
    }
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const stationList = async (reqBody: any) => {
  try {
    for (const machine of reqBody.dcMachine) {
      const data = {};
      await DCMachine.updateOne({ _id: new ObjectId(machine._id) }, data);
    }
    for (const machine of reqBody.ltmMachine) {
      const data = {};
      await LTMMachine.updateOne({ _id: new ObjectId(machine._id) }, data);
    }
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const stationReportDownload = async (reqBody: any) => {
  try {
    for (const machine of reqBody.dcMachine) {
      const data = {};
      await DCMachine.updateOne({ _id: new ObjectId(machine._id) }, data);
    }
    for (const machine of reqBody.ltmMachine) {
      const data = {};
      await LTMMachine.updateOne({ _id: new ObjectId(machine._id) }, data);
    }
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.SUCCESS,
      status: CONSTANT_MSG.STATUS.SUCCESS,
      message: CONSTANT_MSG.MACHINE.MACHINE_FETCHED,
    };
  } catch (error: any) {
    return {
      statusCode: CONSTANT_MSG.STATUS_CODE.ERROR,
      status: CONSTANT_MSG.STATUS.ERROR,
      message: error.message,
    };
  }
};

const reportConvertion = async (dcRows: any, ltmRows: any) => {
  try {
    let dcTableHeader: any = [],
      dcTableData: any = [],
      ltmTableHeader: any = [],
      ltmTableData: any = [];
    if (dcRows.length === 0 && ltmRows.length === 0) {
      return dcRows;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.properties.defaultColWidth = 20;
    if (dcRows.length > 0) {
      dcTableData = dcRows.map((elem: any) => {
        return Object.values(elem);
      });
      const header1 = Object.keys(dcRows[0]);
      dcTableHeader = header1.map((data) => {
        return { name: data, filterButton: true };
      });
      const title1 = worksheet.addRow(["DC NUTRUNNERS"]);
      title1.eachCell((cell: any) => {
        cell.font = {
          name: "Arial Black",
          color: { argb: "FF000000" },
          family: 2,
          size: 14,
          bold: true,
        };
        cell.alignment = { horizontal: "center" };
      });

      worksheet.addTable({
        name: "Table1",
        ref: "A2",
        headerRow: true,
        columns: dcTableHeader,
        rows: dcTableData,
      });

      const table = worksheet.getTable("Table1");
      const headerRow1 = worksheet.getRow(2);
      headerRow1.eachCell((cell) => {
        cell.font = { color: { argb: "FF000000" }, bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "0000b0f0" },
        };
      });
      table.commit();
      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow([]);
    }
    if (ltmRows.length > 0) {
      ltmTableData = ltmRows.map((elem: any) => {
        return Object.values(elem);
      });
      const header2 = Object.keys(ltmRows[0]);
      ltmTableHeader = header2.map((data) => {
        return { name: data, filterButton: true };
      });
      const title2 = worksheet.addRow(["LEAK TEST MACHINE"]);
      title2.eachCell((cell: any) => {
        cell.font = {
          name: "Arial Black",
          color: { argb: "FF000000" },
          family: 2,
          size: 14,
          bold: true,
        };
        cell.alignment = { horizontal: "center" };
      });

      worksheet.addTable({
        name: "Table2",
        ref: `A${dcTableData.length ? dcTableData.length + 7 : 2}`,
        headerRow: true,
        columns: ltmTableHeader,
        rows: ltmTableData,
      });
      const headerRow2 = worksheet.getRow(dcTableData.length ? dcTableData.length + 7 : 2);
      headerRow2.eachCell((cell) => {
        cell.font = { color: { argb: "FF000000" }, bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00a9d08e" },
        };
      });
    }
    worksheet.mergeCells(1, 1, 1, 8);
    if (dcRows.length > 0) {
      worksheet.mergeCells(
        dcTableData.length + 6,
        1,
        dcTableData.length + 6,
        8
      );
    }
    const fileBuffer: any = await workbook.xlsx.writeBuffer();
    return fileBuffer;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default {
  machineList,
  machineListDetails,
  machineDropList,
  reportDownload,
  specificationDropList,
  specificationListDetails,
  allMachineList,
  updateMachineDetails,
  stationList,
  stationReportDownload
};
