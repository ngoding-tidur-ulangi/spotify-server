import { Request, Response } from "express";
import User from "../../models/user";

interface AuthRequest extends Request {
    user?: {
        googleId: string;
        histories: string[];
    };
}

const updateUserHistories = async (req: AuthRequest, res: Response) => {
    try {
        const { songId } = req.body;

        if (!songId) {
            return res.status(400).json({ message: "Song id required" });
        }

        let histories = [...req.user.histories];
        if(histories.includes(songId)){
            res.status(200).json({
                message: 'History updated successfully'
            });
        }else{
            if (histories.length >= 4) {
                histories = histories.slice(1);
            }
            histories.push(songId);
    
            await User.updateOne(
                { googleId: req.user.googleId },
                { $set: { histories: histories } }
            );
    
            res.status(200).json({
                message: 'History updated successfully'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};

export default updateUserHistories;