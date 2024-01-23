import { useLocation } from "react-router-dom";

function DetailedPost() {
  const { state } = useLocation();

  return (
    <div>
      <h1>{state.title}</h1>
      <p>{state.body}</p>
    </div>
  );
}

export default DetailedPost;
