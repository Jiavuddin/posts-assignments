import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function App() {
  const exisitingPosts = JSON.parse(localStorage.getItem("posts"));

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [posts, setPosts] = useState(
    exisitingPosts?.length > 0 ? [...exisitingPosts].reverse() : [],
  );

  const [isUpdate, setIsUpdate] = useState(false);
  const [editPost, setEditPost] = useState({});

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filterOpt, setFilterOpt] = useState(
    exisitingPosts?.length > 0
      ? [...exisitingPosts].map((post) => post.id)
      : [],
  );

  useEffect(() => {
    if (!posts.length) {
      fetchInitialPosts();
    }
  }, []);

  const fetchInitialPosts = async () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts([...data].reverse());
        setFilterOpt(data.map((post) => post.id));
        localStorage.setItem("posts", JSON.stringify(data));
      });
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
    filterItems("title", e.target.value);
  };

  const onChangeFilter = (e) => {
    setFilter(e.target.value);
    filterItems("id", e.target.value);
  };

  const filterItems = (key, value) => {
    if (value !== "") {
      const filteredPosts = JSON.parse(localStorage.getItem("posts")).filter(
        (post) => {
          if (key === "title") {
            return post[key].toLowerCase().includes(value.toLowerCase());
          } else {
            return post[key] === Number(value);
          }
        },
      );
      setPosts([...filteredPosts].reverse());
    } else {
      setPosts([...JSON.parse(localStorage.getItem("posts"))].reverse());
    }
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
        let exisitingP = [...JSON.parse(localStorage.getItem("posts"))];
        if (isUpdate) {
          setEditPost({});
          setIsUpdate(false);
          exisitingP = exisitingP.map((post) => {
            if (post.id === json.id) {
              return json;
            }
            return post;
          });
        } else {
          exisitingP.push(json);
        }
        setPosts([...exisitingP].reverse());
        localStorage.setItem("posts", JSON.stringify(exisitingP));
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
      .then(() => {
        const exisitingP = [...JSON.parse(localStorage.getItem("posts"))];
        const filteredPosts = exisitingP.filter((item) => item.id !== id);
        setPosts([...filteredPosts].reverse());
        setFilterOpt(filteredPosts.map((post) => post.id));
        localStorage.setItem("posts", JSON.stringify(filteredPosts));
      });
  };

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
      <h1>{posts.length}</h1>

      <input
        type="text"
        value={search}
        placeholder="Search"
        onChange={onChangeSearch}
      />
      <br />
      <select value={filter} onChange={onChangeFilter}>
        <option value="">select</option>
        {filterOpt?.length > 0 &&
          filterOpt.map((opt) => (
            <option key={`filter-opt-${opt}`} value={opt}>
              {opt}
            </option>
          ))}
      </select>

      <ul>
        {posts.length > 0 &&
          posts.map((post) => (
            <li>
              <Link key={post.id} to={`/${post.id}`} state={post}>
                <h3>{post.title}</h3>
              </Link>
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
