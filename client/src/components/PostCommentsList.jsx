const PostCommentsList = ({ comments }) => {
  return (
    <>
      <h6>Comments ({comments.length})</h6>
      <ul>
        {comments.map((comment) => {
          let content = '';

          switch (comment.status) {
            case 'approved':
              content = comment.content;
              break;
            case 'rejected':
              content = 'This comment has ben rejected';
              break;

            default:
              content = 'This comment is awaiting moderation';
              break;
          }

          return (
            <li
              key={comment.id}
              className={comment.status !== 'approved' && 'fw-light fst-italic fs-6'}
            >
              {content}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PostCommentsList;
