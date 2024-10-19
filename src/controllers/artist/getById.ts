import { Request, Response } from "express";
import Artist from "../../models/artist";

const getById = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
      const artist = await Artist.findById(id)
      res.status(200).json(artist)
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }

  export default getById