import { Request, Response } from "express";
import Artist from "../../models/artist";
import Song from "../../models/song";
import User from "../../models/user";

const getRelatedSongs = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ googleId: (req.user as any).googleId })
        if(user.histories.length == 0){
            res.send([])
        }
        const songId = user.histories[user.histories.length-1];
        const targetSong = await Song.findById(songId)
        if (!targetSong) {
            return res.status(404).json({ message: "Song not found" });
        }
        
        const songAll = await Song.find({ _id: { $ne: songId } })

        const kNearestSongs = songAll
        .map(song => {
            let tmpDistance = 0
            song.artists.forEach(artist => {
                if (!targetSong.artists.includes(artist)) {
                    tmpDistance++;
                }
            });

            song.genres.forEach(genre => {
                if (!targetSong.genres.includes(genre)) {
                    tmpDistance++;
                }
            });

            return {
                _id: song._id,
                title: song.title,
                genres: song.genres,
                artists: song.artists,
                image: song.image,
                audio: song.audio,
                createdAt: song.createdAt,
                distance: tmpDistance
            }
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 8)

        const artists = await Artist.find();

        const artistMap = new Map(
            artists.map(artist => [artist._id.toString(), artist.name])
        );

        const mappedSongs = kNearestSongs.map(song => ({
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

export default getRelatedSongs;