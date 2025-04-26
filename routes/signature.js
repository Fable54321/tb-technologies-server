import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// For resolving __dirname since it's not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();



router.get('/save-signature', (req, res) => {
    res.send('Save-signature route is working!');
  });

router.use(cors())

router.post('/save-signature', async (req, res) => {
  const { signature, fullName, email } = req.body;

  if (!signature || !fullName || !email) {
    return res.status(400).send('Missing required fields');
  }

  // Decode the base64 image
  const base64Data = signature.replace(/^data:image\/png;base64,/, '');

  // Save the image to the server
  const fileName = `${fullName.replace(/\s+/g, '_')}_${Date.now()}.png`;
  const filePath = path.join(__dirname, '../signatures', fileName);

  try {
    await fs.promises.writeFile(filePath, base64Data, 'base64');
    res.send('Signature saved successfully');
  } catch (err) {
    console.error('Error saving signature:', err);
    res.status(500).send('Failed to save signature');
  }
});

export default router;