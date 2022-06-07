import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

const events = [];

app.post('/events', async (req, res) => {
  const event = req.body;

  events.push(event);

  try {
    await Promise.allSettled([
      axios.post('http://posts-clusterip-srv:4000/events', event),
      axios.post('http://localhost:4001/events', event),
      axios.post('http://localhost:4002/events', event),
      axios.post('http://localhost:4003/events', event),
    ]);
  } catch (error) {
    console.error(error);
  }

  return res.json({ status: 'ok' });
});

app.get('/events', (_req, res) => {
  return res.status(200).json(events);
});

app.listen(4005, () => {
  console.log('Event Bus listening on port: 4005');
});
