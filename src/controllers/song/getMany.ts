import { Request, Response } from "express";
import Artist from "../../models/artist";
import Song from "../../models/song";
import mongoose from "mongoose";

const getMany = async (req: Request, res: Response) => {
  try {
    const songs = await Song.aggregate([{ $sample: { size: 8 } }]);

    const artistIds = [...new Set(
      songs.flatMap(song => song.artists)
    )].map(id => new mongoose.Types.ObjectId(id));

    const artists = await Artist.find({
      _id: { $in: artistIds }
    });

    const artistMap = new Map(
      artists.map(artist => [artist._id.toString(), artist.name])
    );

    const mappedSongs = songs.map(song => ({
      _id: song._id,
      title: song.title,
      artists: song.artists.map(artistId => ({
        id: artistId,
        name: artistMap.get(artistId.toString()) || 'Unknown Artist'
      })),
      genres: song.genres,
      image: song.image,
      audio: song.audio,
      createdAt: song.createdAt
    }));

    res.status(200).json(mappedSongs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getMany;