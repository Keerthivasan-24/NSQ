"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecords = void 0;
const db_service_1 = require("../services/db.service");
const getRecords = (req, res, next) => {
    try {
        const user = req.user;
        let records;
        if (user.role === 'Admin') {
            records = db_service_1.dbService.getRecords();
        }
        else {
            records = db_service_1.dbService.getRecordsByUserId(user.userId);
        }
        res.json({
            success: true,
            records
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecords = getRecords;
