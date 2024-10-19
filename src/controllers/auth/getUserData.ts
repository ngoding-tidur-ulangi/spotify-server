import { Request, Response } from "express"
import Song from "../../models/song";
import Artist from "../../models/artist";

interface AuthRequest extends Request {
    user?: {
        _id: string
        googleId: string;
        displayName: string
        email: string
        createdAt: string
        histories: string[]
        favorites: string[]
    }
}

const getUserData = async (req: AuthRequest, res: Response) => {
    try {
        const songAll = await Song.find()
        const artistAll = await Artist.find()

        const songs = songAll.filter(song => req.user.histories.includes(String(song._id)))
    
        const artistMap = new Map(
          artistAll.map(artist => [artist._id.toString(), artist.name])
        );
    
        const mappedHistories = songs.map(song => ({
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

        const mappedFavorites = artistAll.filter(artist => req.user.favorites.includes(String(artist._id)))

        res.status(200).json({
            _id: req.user._id,
            googleId: req.user.googleId,
            displayName: req.user.displayName,
            email: req.user.email,
            createdAt: req.user.createdAt,
            favorites: mappedFavorites,
            histories: mappedHistories
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

export default getUserData