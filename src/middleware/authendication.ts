import Jwt from 'jsonwebtoken';
import { Token } from "../models/token.model";
import 'dotenv/config';
import { CONSTANT_MSG } from '../common/constant_message';
import { Response, NextFunction } from 'express';
const JWT_TOKEN_SECRET_KEY: any = process.env.JWT_TOKEN_SECRET_KEY;

export const checkJwtToken = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ statuCode: 401, message: CONSTANT_MSG.ERROR_MSG.UNAUTHORIZED_NO_PERMISSION_ERROR });
    }
    const token = authHeader.split(' ')[1]
    if (token) {
        const userTokenValid = await Token.findOne({ token: token });
        if (!userTokenValid) {
            return res.status(401).send({ statuCode: 401, message: CONSTANT_MSG.ERROR_MSG.UNAUTHORIZED_NO_PERMISSION_ERROR, data: { isLogout: true } });
        }
        Jwt.verify(token, JWT_TOKEN_SECRET_KEY, (err: any, user: any) => {
            if (err) {
                return res.status(401).send({ statuCode: 401, message: err.message, data: { isTokenExpired: true } });
            } else {
                req.user = user;
                next();
            }
        });
    }
    else {
        return res.status(401).send({ statuCode: "401", message: "Invalid Request : Authentication Error" });
    }
};

export const getJwtToken = async (req: any) => {
    const token = Jwt.sign({ userRole: req.role, userId: req._id.toString() }, JWT_TOKEN_SECRET_KEY, { expiresIn: "90d" });
    const Obj = {
        token: token,
        userId: req._id
    }
    const tokenSave = new Token(Obj)
    await tokenSave.save()
    return token
};