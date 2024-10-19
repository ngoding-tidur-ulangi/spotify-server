import { Request, Response } from "express";
import bucket from "../../utils/gcs";

const getAudio = async (req: Request, res: Response) => {
  const filename = req.params.filename

  try {
    const file = bucket.file(filename);

    const readStream = file.createReadStream();

    res.set('Content-Type', 'audio/mpeg');

    readStream
      .on('error', (err) => {
        console.error('Error reading from GCS:', err);
        res.status(500).send('Error streaming audio');
      })
      .pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error retrieving audio file');
  }
}

  export default getAudio