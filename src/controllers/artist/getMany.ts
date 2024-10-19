import { Request, Response } from "express";
import Artist from "../../models/artist";

const getMany = async (req: Request, res: Response) => {
  try {
    const artists = await Artist.aggregate([{ $sample: { size: 8 } }]);
    res.status(200).json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

  export default getMany