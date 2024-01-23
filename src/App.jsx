import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function App() {
  const exisitingPosts = JSON.parse(localStorage.getItem("posts"));

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [posts, setPosts] = useState(exisitingPosts || []);
  const [filteredPosts, setFilteredPosts] = useState(exisitingPosts || []);

  // const [count, setCount] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [editPost, setEditPost] = useState({});

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filterOpt, setFilterOpt] = useState([]);

  useEffect(() => {
    if (!posts.length) {
      fetchInitialPosts();
    }
  }, []);

  useEffect(() => {
    filterItems("title", search);
  }, [search]);

  useEffect(() => {
    filterItems("id", filter);
  }, [filter]);

  const fetchInitialPosts = async () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setFilteredPosts([...data]);
        setFilterOpt(data.map((post) => post.id));
        localStorage.setItem("posts", JSON.stringify(data));
      });
  };

  const filterItems = (key, value) => {
    const exisitingPosts = [...posts];

    const filteredPosts = exisitingPosts.filter((post) => {
      if (key === "title") {
        return post[key].toLowerCase().includes(value.toLowerCase());
      } else {
        return post[key] === Number(value);
      }
    });

    setFilteredPosts([...filteredPosts]);
  };

  const onAddUpdatePost = async () => {
    fetch(
      `https://jsonplaceholder.typicode.com/posts/${isUpdate ? editPost.id : ""}`,
      {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify({
          title: title,
          body: body,
          userId: posts.length + 1,
          ...(isUpdate && {
            id: editPost.id,
          }),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    )
      .then((response) => response.json())
      .then((json) => {
        let exisitingPosts = [...posts];
        // fetchInitialPosts(false);
        if (isUpdate) {
          setEditPost({});
          setIsUpdate(false);
          exisitingPosts[editPost.id - 1] = json;
        } else {
          exisitingPosts.push(json);
          // setCount((prevState) => prevState + 1);
        }
        setPosts(exisitingPosts);
        setFilteredPosts([...exisitingPosts]);
        localStorage.setItem("posts", JSON.stringify(exisitingPosts));
        setTitle("");
        setBody("");
      });
  };

  const onEdit = (post) => {
    setIsUpdate(true);
    setTitle(post.title);
    setBody(post.body);
    setEditPost(post);
  };

  const onDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((json) => {
        const exisitingPosts = [...posts];
        const filteredPosts = exisitingPosts.filter((item) => item.id !== id);
        setPosts(filteredPosts);
        setFilteredPosts([...filteredPosts]);
        localStorage.setItem("posts", JSON.stringify(filteredPosts));
      });
  };

  console.log(posts);
  console.log(filteredPosts);

  return (
    <div className="App">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button type="button" onClick={onAddUpdatePost}>
        {isUpdate ? "Update" : "Add"} Post
      </button>
      <h1>{filteredPosts.length}</h1>

      <input
        type="search"
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <br />
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        {filterOpt?.length > 0 &&
          filterOpt.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
      </select>

      <ul>
        {filteredPosts?.length > 0 &&
          [...filteredPosts].reverse().map((post) => (
            <li>
              <Link key={post.id} to={`/${post.id}`} state={post}>
                <h3 onClick={() => onClickPost(post)}>{post.title}</h3>
              </Link>
              {/* <p>{post.body}</p> */}
              <button type="button" onClick={() => onEdit(post)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(post.id)}>
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
