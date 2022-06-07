import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  let httpStatus = 200;
  let message = '';

  if (type === 'POST_CREATED') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };

    httpStatus = 201;
    message = 'Post created successfully.';
  }

  if (type === 'COMMENT_CREATED') {
    const { id, postId, content, status } = data;
    const post = posts[postId];

    post.comments.push({ id, content, status });

    httpStatus = 201;
    message = 'Comment added successfully.';
  }

  if (type === 'COMMENT_UPDATED') {
    const { id, postId, content, status } = data;
    const post = posts[postId];

    const comment = post.comments.find((c) => c.id === id);

    comment.status = status;
    comment.content = content;

    httpStatus = 201;
    message = 'Comment updated successfully.';
  }

  return { httpStatus, message };
};

app.get('/posts', (_req, res) => {
  return res.json(Object.keys(posts).length ? { data: posts } : { message: 'No posts available.' });
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  const { httpStatus, message } = handleEvent(type, data);

  return res.status(httpStatus).json({ message });
});

app.listen(4002, async () => {
  console.log('Query Service listening on port: 4002');

  try {
    const { data: events } = await axios.get('http://localhost:4005/events');

    for (let event of events) {
      const { type, data } = event;
      console.log('Processing event: ', type);

      handleEvent(type, data);
    }
  } catch (error) {
    console.error('Error fetching all events.');
  }
});
