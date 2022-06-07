import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';

const app = express();

const posts = {};

app.use(cors());
app.use(express.json());

app.get('/posts', (_req, res) => {
  return res.json(Object.keys(posts).length ? { data: posts } : { message: 'No posts available.' });
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  try {
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'POST_CREATED',
      data: { id, title },
    });

    return res.status(201).json({
      message: 'Post created successfully.',
      data: posts[id],
    });
  } catch (error) {
    console.error('Error emitting event');
    posts[id] = undefined;

    return res.status(400).json({ message: error.message });
  }
});

app.post('/events', (req, res) => {
  const event = req.body;

  console.log('Received Event: ', event.type);

  return res.status(200).json(event);
});

app.listen(4000, () => {
  console.log('Posts Service listening on port: 4000.');
});
