import { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (title) {
        await axios.post('http://localhost:4000/posts', { title });
        setTitle('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h3>Create Post</h3>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label' htmlFor='addPostInput'>
            Title
          </label>
          <input
            id='addPostInput'
            type='text'
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete='off'
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </>
  );
};

export default CreatePost;
