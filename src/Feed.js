import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import "./Feed.css";
import InputOption from "./InputOption";
import FlipMove from "react-flip-move";
import Post from "./Post";
import {
  db,
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  orderBy,
} from "./firebase";
import { selectUser } from "./features/userSlice";
import { useSelector } from "react-redux";

const Feed = () => {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "posts"), orderBy("timestamp", "desc"))
    );
    setPosts(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sendPost = async (e) => {
    e.preventDefault();
    const postData = {
      name: user.displayName,
      description: user.email,
      message: input,
      photoUrl: user.photoUrl || "",
      timestamp: Timestamp.now(),
    };

    setInput("");

    await addDoc(collection(db, "posts"), postData);

    // Fetch data after adding the post to update the state
    await fetchData();
  };

  return (
    <div className="feed">
      <div className="feed__inputContainer">
        <div className="feed__input">
          <CreateIcon />
          <form>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
            />
            <button onClick={sendPost} type="submit">
              Send
            </button>
          </form>
        </div>
        <div className="feed__inputOptions">
          <InputOption title="Photo" Icon={ImageIcon} color="#70B5F9" />
          <InputOption title="video" Icon={SubscriptionsIcon} color="#E7A33E" />
          <InputOption title="Event" Icon={EventNoteIcon} color="#C0CBCD" />
          <InputOption
            title="Write article"
            Icon={CalendarViewDayIcon}
            color="#7FC15E"
          />
        </div>
      </div>

      <FlipMove>
        {posts.map(({ id, data: { name, description, message, photoUrl } }) => (
          <Post
            key={id}
            name={name}
            description={description}
            message={message}
            photoUrl={photoUrl}
          />
        ))}
      </FlipMove>
    </div>
  );
};

export default Feed;
