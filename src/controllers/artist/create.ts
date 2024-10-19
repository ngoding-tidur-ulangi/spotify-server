import { Request, Response } from "express";
import bucket from "../../utils/gcs";
import Artist from "../../models/artist";

const create = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || !req.file) {
            return res.status(400).json({ message: 'Name and image are required' });
        }

        const file = req.file;
        const blob = bucket.file(Date.now() + '_image' + "." + file.originalname.split(".").at(-1));
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (err) => {
            return res.status(500).json({ message: 'Failed to upload image', error: err.message });
        });

        blobStream.on('finish', async () => {
            const imageUrl = blob.name;

            const newArtist = new Artist({
                name,
                image: imageUrl,
            });

            await newArtist.save();

            res.status(201).json({
                message: 'Artist created successfully',
                artist: newArtist,
            });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default create