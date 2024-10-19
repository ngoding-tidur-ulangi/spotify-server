import { Request, Response } from "express";
import Song from "../../models/song";
import Artist from "../../models/artist";
import mongoose from "mongoose";

const getByArtist = async (req: Request, res: Response) => {
    try {
        const { artistId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: "Invalid artist ID format" });
        }
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const songs = await Song.find({
            artists: { $in: [artistId] }
        });

        const artistIds = [...new Set(
            songs.flatMap(song => song.artists)
        )].map(id => new mongoose.Types.ObjectId(id));

        const artists = await Artist.find({
            _id: { $in: artistIds }
        });

        const artistMap = new Map(
            artists.map(artist => [artist._id.toString(), artist.name])
        );

        const response = songs.map(song => ({
            _id: song._id,
            title: song.title,
            artists: song.artists.map((artist: string) => ({
                _id: artist,
                name: artistMap.get(artist.toString()) || 'Unknown Artist'
            })),
            genres: song.genres,
            image: song.image,
            audio: song.audio,
            createdAt: song.createdAt
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getByArtist;