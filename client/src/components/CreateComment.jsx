import { useState } from 'react';
import axios from 'axios';

const CreateComment = ({ postId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (content) {
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content });
        setContent('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label' htmlFor='addCommentInput'>
            Add comment
          </label>
          <input
            id='addCommentInput'
            type='text'
            className='form-control form-control-sm'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoComplete='off'
          />
        </div>
        <button className='btn btn-sm btn-primary'>Submit</button>
      </form>
    </>
  );
};

export default CreateComment;
