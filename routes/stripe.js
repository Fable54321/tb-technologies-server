import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config();


const router = express.Router()

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);


router.post('/create-checkout-session', async (req, res) => {
    try {
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: 'price_1RH5MWAcYfrWLmlsiRzuzPGq', // Replace with your actual price ID
            quantity: 1,
          },
        ],
        success_url: 'https://your-frontend.com/success',
        cancel_url: 'https://your-frontend.com/cancel',
      });
  
      res.json({ url: session.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  export default router; 