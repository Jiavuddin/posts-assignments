import { useParams } from "react-router-dom";

function DetailedPost() {
  const params = useParams();

  console.log(params);

  //   const [post, setPost] = useState({});
  return <div>Detailed Post</div>;
}

export default DetailedPost;
