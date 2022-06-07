import CreatePost from './components/CreatePost';
import PostList from './components/PostList';

const App = () => {
  return (
    <div className='container'>
      <CreatePost />
      <hr />
      <PostList />
    </div>
  );
};

export default App;
