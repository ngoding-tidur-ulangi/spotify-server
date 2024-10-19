import { Request, Response } from "express"

const logout = (req: Request, res: Response) => {
    req.logout(
        function (err) {
            if (err) {
                res.sendStatus(500)
            }
            req.session.destroy(function(err) {
                if (err) {
                    return res.status(500).json({ message: "Failed to destroy session" });
                }
                res.clearCookie('connect.sid');
                res.status(200).json({ message: "Logged out and session destroyed" });
            });
        }
    )
}

export default logout