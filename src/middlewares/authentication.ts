import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User from "../models/user";

const authentication = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            try {
                const userDetail = await User.findById((user as any).id)
                req.user = userDetail;
            }catch(err){
                return res.sendStatus(500)
            }
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

export default authentication