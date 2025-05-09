import express from 'express';
import nodeMailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const from = process.env.EMAIL_FROM;
const to = process.env.EMAIL_TO;
const subject = 'Nouvel intérêt pour l\'offre publicitaire';

const transport = nodeMailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  secureConnection: 'STARTTLS',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const adRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Trop de soumissions. Veuillez réessayer plus tard.',
  },
});

router.post('/interest', adRateLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse courriel invalide.' });
  }

  const mailOptions = {
    from,
    to,
    subject,
    text: `Une personne est intéressée par l'offre à 2700$.\n\nCourriel: ${email}`,
  };

  try {
    await transport.sendMail(mailOptions);
    res.status(200).json({ message: 'Courriel envoyé avec succès.' });
  } catch (err) {
    console.error('Email sending failed:', err);
    res.status(500).json({ error: 'Échec de l\'envoi du courriel.' });
  }
});

export default router;