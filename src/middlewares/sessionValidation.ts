import { Request, Response, NextFunction } from "express"

const sessionValidation = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next()
    }else{
        res.sendStatus(401)
    }
}

export default sessionValidation