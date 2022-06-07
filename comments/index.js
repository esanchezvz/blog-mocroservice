import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';

const app = express();

const commentsByPostId = {};

app.use(cors());
app.use(express.json());

app.get('/posts/:id/comments', (req, res) => {
  return res.json(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const status = 'pending';
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  const newComment = { id: commentId, content, postId: req.params.id, status };

  comments.push(newComment);

  commentsByPostId[req.params.id] = comments;

  try {
    await axios.post('http://localhost:4005/events', {
      type: 'COMMENT_CREATED',
      data: { id: commentId, content, postId: req.params.id, status },
    });

    return res.status(201).json({ message: 'Comment created successully.', data: newComment });
  } catch (error) {
    console.error('Error emitting event `COMMENT_CREATED`');
    commentsByPostId[req.params.id].pop();

    return res.status(400).json({ message: error.message });
  }
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  let httpStatus = 200;
  let message = '';

  if (type === 'COMMENT_MODERATED') {
    const { id, postId, status } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((c) => c.id === id);
    const prevComment = { ...comment };
    comment.status = status;

    try {
      await axios.post('http://localhost:4005/events', {
        type: 'COMMENT_UPDATED',
        data: comment,
      });

      httpStatus = 203;
      message = 'Comment moderated successfully.';
    } catch (error) {
      comment.status = prevComment.status;
      console.error('Error emitting event `COMMENT_UPDATED`');

      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(httpStatus).json({ message });
});

app.listen(4001, () => {
  console.log('Comments Service listening on port: 4001');
});
