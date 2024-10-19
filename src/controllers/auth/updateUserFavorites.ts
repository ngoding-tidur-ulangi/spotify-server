import { Request, Response } from "express";
import User from "../../models/user";

interface AuthRequest extends Request {
    user?: {
        googleId: string;
        favorites: string[];
    };
}

const updateUserFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const { favorites } = req.body;

        if (!favorites || !Array.isArray(favorites)) {
            return res.status(400).json({ 
                message: "Favorites must be provided as an array" 
            });
        }else{
            await User.updateOne(
                { googleId: req.user.googleId },
                { $set: { favorites: favorites } }
            );
    
            res.status(200).json({
                message: 'Favorites updated successfully',
                favorites: favorites
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

export default updateUserFavorites;