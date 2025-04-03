import { NextFunction, Request, Response } from 'express';
import { getDevice } from "@bas/service/device-service";

const getDeviceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new Error("Invalid device ID");
        }
        const data = await getDevice(id);
        return res.success({ data });
    } catch (error: any) {
        next(error);
    }
}

export default {
    getDeviceById,
};