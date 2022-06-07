import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import CreateComment from './CreateComment';
import PostCommentsList from './PostCommentsList';

const PostList = () => {
  const [posts, setPosts] = useState({});
  const postsArray = useMemo(() => Object.values(posts), [posts]);

  const fetchPosts = async () => {
    try {
      const {
        data: { data },
      } = await axios.get('http://localhost:4002/posts');

      setPosts(data || {});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <h3>Posts</h3>
      <div className='row g-3 pb-3'>
        {postsArray.map((post) => (
          <div className='col-12 col-md-4' key={post.id}>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>{post.title}</h5>

                <div className='card-text'>
                  <PostCommentsList comments={post.comments} />
                  <CreateComment postId={post.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
