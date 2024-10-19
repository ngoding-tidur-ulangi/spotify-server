import { Request, Response } from "express";
import Artist from "../../models/artist";
import Song from "../../models/song";

const getRelatedSongsFromQueue = async (req: Request, res: Response) => {
    try {
        const { queue }: {queue: any[]} = req.body;
        const queueIds = queue.map(song => song._id)
        let songs = await Song.find()
        if(queue.length < 14){
            songs = songs.filter(song => !queueIds.includes(String(song._id)))
        }

        const targetSong = {
            ...queue[queue.length-1],
            artists: queue[queue.length-1].artists.map(artist => artist.id)
        }

        const kNearestSongs = songs
        .map(song => {
            let tmpDistance = 0
            song.artists.forEach(artist => {
                if (!targetSong.artists.includes(String(artist))) {
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
        .slice(0, 5)

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

export default getRelatedSongsFromQueue;