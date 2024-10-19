import { Request, Response } from "express";
import bucket from "../../utils/gcs";
import Song from "../../models/song";

const create = async (req: Request, res: Response) => {
    try {
        const { files } = req;
        const { title, artists, genres } = req.body;

        if (!title || !artists || !genres || !files["image"] || !files["audio"]) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const imageFile = files["image"][0];
        const audioFile = files["audio"][0];

        const uploadToGCS = (file: Express.Multer.File, type: string) => {
            const blob = bucket.file(Date.now() + '_' + type + "." + file.originalname.split(".").at(-1));
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype
            });
            return new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    return res.status(500).json({ message: 'Failed to upload image', error: err.message });
                });

                blobStream.on('finish', async () => {
                    resolve(blob.name)
                });

                blobStream.end(file.buffer);
            })
        }
        const imageUrl = await uploadToGCS(imageFile, "image");
        const audioUrl = await uploadToGCS(audioFile, "audio");

        const newSong = new Song({
            title,
            artists: JSON.parse(artists),
            genres: JSON.parse(genres),
            image: imageUrl,
            audio: audioUrl
        });

        await newSong.save();

        res.status(201).json({
            message: 'Song created successfully',
            song: newSong,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default create