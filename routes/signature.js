import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import Contract from '../models/Contract.js';
import puppeteer from 'puppeteer';

// For resolving __dirname since it's not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(__dirname, '../signatures'));
ensureDir(path.join(__dirname, '../pdfs'));

const router = express.Router();

router.use(express.json());
router.use(cors())


router.get('/save-signature', (req, res) => {
  res.send('Save-signature route is working!');
});

router.post('/save-signature', async (req, res) => {
  const { signature, fullName, email, contract, date, contractHash, contractHtml, time } = req.body;

  if (!signature || !fullName || !email || !contract || !date || !contractHash || !contractHtml ||!time) {
    return res.status(400).send('Missing required fields');
  }

  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const base64Data = signature.replace(/^data:image\/png;base64,/, '');
  const fileName = `${fullName.replace(/\s+/g, '_')}_${Date.now()}.png`;
  const filePath = path.join(__dirname, '../signatures', fileName);
  const fileUrl = `/signatures/${fileName}`;

  try {
    await fs.promises.writeFile(filePath, base64Data, 'base64');

    


     const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
     });

    const page = await browser.newPage(); 

    await page.setContent(contractHtml, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(__dirname, `../pdfs/${fileName.replace('.png', '.pdf')}`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    const pdfUrl = `/pdfs/${path.basename(pdfPath)}`;

     const newContract = new Contract({
      fullName,
      email,
      contract,
      contractHash,
      date,
      signature: fileUrl,
      pdfUrl, 
      ipAddress, 
      time
    });
  
  
     const savedContract = await newContract.save(); // saves to Atlas

    
    

    res.status(200).json({
      message: 'Contract and signature saved, PDF generated',
      contractId: savedContract._id,
      pdfUrl: `/pdfs/${path.basename(pdfPath)}`
    });




    
  } catch (err) {
    console.error('Error saving contract to the database', err.message);
    console.error(err);
    res.status(500).send('Failed to save signature');
  }
});

export default router;