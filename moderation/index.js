import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

const handleEvent = async (type, data) => {
  let httpStatus = 200;
  let message = '';

  if (type === 'COMMENT_CREATED') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    try {
      await axios.post('http://localhost:4005/events', {
        type: 'COMMENT_MODERATED',
        data: {
          id: data.id,
          content: data.content,
          postId: data.postId,
          status,
        },
      });

      message = 'Comment has been moderated.';
    } catch (error) {
      console.error('Error emitting event `COMMENT_MODERATED`');

      return Promise.reject({ status, message });
    }
  }

  return Promise.resolve({ httpStatus, message });
};

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  try {
    const { httpStatus, message } = await handleEvent(type, data);

    return res.status(httpStatus).json({ message });
  } catch (error) {
    return res.json(error);
  }
});

app.listen(4003, async () => {
  console.log('Moderation Service listening on port: 4003');

  try {
    const { data: events } = await axios.get('http://localhost:4005/events');

    await Promise.all(
      events.map((event) => {
        const { type, data } = event;
        console.log('Processing event: ', type);

        return handleEvent(type, data);
      })
    );
  } catch (error) {
    console.error('Error fetching all events.');
  }
});
