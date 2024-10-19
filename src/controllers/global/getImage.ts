import { Request, Response } from "express";
import bucket from "../../utils/gcs";

const getImage = async (req: Request, res: Response) => {
    const filename = req.params.filename
    try {
      const file = bucket.file(filename);
      
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      const readStream = file.createReadStream();
      res.setHeader('Content-Type', 'image/jpeg');
      readStream.pipe(res);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch image', error: error.message });
    }
  }

  export default getImage