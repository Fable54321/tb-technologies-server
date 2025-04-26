import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import Contract from '../models/Contract.js';

// For resolving __dirname since it's not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(express.json());

router.get('/save-signature', (req, res) => {
    res.send('Save-signature route is working!');
  });

router.use(cors())

router.post('/save-signature', async (req, res) => {
  const { signature, fullName, email, contract, date, contractHash } = req.body;

  if (!signature || !fullName || !email || !contract || !date) {
    return res.status(400).send('Missing required fields');
  }

  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Decode the base64 image
  const base64Data = signature.replace(/^data:image\/png;base64,/, '');

  // Save the image to the server
  const fileName = `${fullName.replace(/\s+/g, '_')}_${Date.now()}.png`;
  
  const filePath = path.join(__dirname, '../signatures', fileName);
  const fileUrl = `/signatures/${fileName}`;

  try {
    await fs.promises.writeFile(filePath, base64Data, 'base64');

     // Save the contract info into MongoDB
     const newContract = new Contract({
        fullName,
        email,
        contract,
        contractHash,
        date,
        signature: fileUrl, // or adjust if you want a URL instead
        ipAddress
      });
  
      await newContract.save(); // saves to Atlas


    res.send('Signature saved successfully');
  } catch (err) {
    console.error('Error saving contract to the database', err.message);
    console.error(err);
    res.status(500).send('Failed to save signature');
  }
});

export default router;