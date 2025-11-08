import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { addblog } from '../utilis/blogSlice';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import Comments from '../component/Comments';
import { setIsOpen } from '../utilis/commentSlice';
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { followuser, setsaveblog } from '../utilis/userSlice';
import { MdDelete, MdEdit } from 'react-icons/md';

function Blogpage() {
  const { blogId } = useParams();
  const [blogcreator, setcreator] = useState(null);
  const [blogData, setBlog] = useState(null);
  const [user, setuser] = useState(null);
  const [like, setlike] = useState(false);
  const [save, setsave] = useState();
  const [follow, setfollow] = useState(null);
  const { token } = useSelector(slice => slice.user);
  const blogg = useSelector(slice => slice.blog);
  const userr = useSelector(slice => slice.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deletepop, setdeletepopup] = useState(false);
  const { isOpen } = useSelector(slice => slice.comment);

  // ✅ Decode user before fetching blog
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setuser(decoded.id);
      checkfollow();
    }
  }, [token, userr]);

  // ✅ Fetch blog only after user is set
  useEffect(() => {
    if (user || !token) {
      fetchById();
    }
  }, [blogId, user]);

  async function deleteblog() {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKENED_URL}/blog/delete/${blogg._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  // ✅ Follow
  async function handleFollow(id) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKENED_URL}/follow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      dispatch(followuser({ id }));
    } catch (error) {
      console.log(error);
    }
  }

  // ✅ Check Follow
  function checkfollow() {
    if (!userr?.following || !blogData?.creator?._id) return;

    const isFollowing = userr.following.some(
      (item) => item?._id === blogData.creator._id
    );

    setfollow(isFollowing);
  }

  // ✅ Fetch Blog by ID
  async function fetchById() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKENED_URL}/blog/${blogId}`
      );
      const blog = res.data.blog;

      setBlog(blog);
      dispatch(addblog(blog));
      setcreator(blog.creator._id);

      // ✅ Check if current user liked
      if (token && blog.likes?.includes(user)) {
        setlike(true);
      } else {
        setlike(false);
      }

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load blog");
    }
  }

  // ✅ Like toggle
  async function handlelike() {
    if (!token) return toast.error("Please login to like blogs");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKENED_URL}/blog/like/${blogData._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);

      setlike((prev) => !prev);

      setBlog((prev) => ({
        ...prev,
        likes: like
          ? prev.likes.filter((id) => id !== user)
          : [...prev.likes, user],
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to like post");
    }
  }

  function deletepopup() {
    setdeletepopup((prev) => !prev);
  }

  // ✅ Bookmark Blog
  async function bookmark(blogId) {
    if (!token) return toast.error("Please login to save blogs");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKENED_URL}/save/${user}/bookmark/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      dispatch(setsaveblog({ blogId }));

      setsave(res.data.success);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save blog");
    }
  }

  if (!blogData) {
    return <div>Loading blog...</div>;
  }

  // ✅ Safe Tags
  const tags = blogData?.tags?.[0]?.split(",") || [];

  return (
    <div className="w-full flex justify-center items-center mt-4">
      <div className="border-2 md:w-[50vw] w-[100vw] h-fit flex flex-col gap-6 p-4 rounded-md shadow">

        {/* Title */}
        <div className="flex flex-col gap-10">
          <h1 className="text-3xl font-bold whitespace-pre-wrap break-words leading-relaxed">
            {blogData.title}
          </h1>
        </div>

        {/* User */}
        <div className="flex gap-2 items-center">
          <div className="w-12 h-12 border rounded-full">
            <Link to={token ? `/profile/${blogData.creator.username}` : "/"}>
              <img
                className="w-full h-full rounded-full"
                src={
                  blogData.creator.profilePic
                    ? blogData.creator.profilePic
                    : `https://api.dicebear.com/9.x/initials/svg?seed=${blogData.creator.name}`
                }
                alt=""
              />
            </Link>
          </div>

          <div>
            <div className="flex gap-1.5 items-center">
              <Link to={token ? `/profile/${blogData.creator.username}` : "/"}>
                <p className="font-bold cursor-pointer">
                  {blogData.creator.name}
                </p>
              </Link>

              {token && blogData.creator._id !== userr.id && (
                <p
                  className="border-2 p-1.5 rounded-2xl text-[12px] bg-black text-white cursor-pointer"
                  onClick={() => handleFollow(blogData.creator._id)}
                >
                  {userr?.following?.includes(blogData.creator._id)
                    ? "Unfollow"
                    : "Follow"}
                </p>
              )}
            </div>
            <p>{blogData.createdAt.slice(0, 10)}</p>
          </div>
        </div>

        {/* Description */}
        <p className="whitespace-pre-wrap leading-relaxed">
          {blogData.description}
        </p>

        {/* Image */}
        {blogData.image && (
          <div className="w-full h-[60vh]">
            <img
              className="w-full h-full object-cover rounded-md"
              src={blogData.image}
              alt={blogData.title}
            />
          </div>
        )}

        {/* Likes, Comments, Bookmark */}
        <div className="flex gap-5 items-center">
          {/* Like */}
          <div className="flex gap-1 items-center">
            {like ? (
              <AiFillLike
                className="text-2xl text-blue-500 cursor-pointer"
                onClick={handlelike}
              />
            ) : (
              <AiOutlineLike
                className="text-2xl cursor-pointer"
                onClick={handlelike}
              />
            )}
            <p className="text-[20px]">{blogData.likes.length}</p>
          </div>

          {/* Comment */}
          <div className="flex gap-1 items-center">
            <FaRegComment
              className="text-[20px] cursor-pointer"
              onClick={() => dispatch(setIsOpen())}
            />
            <p className="text-[20px]">{blogg?.comments?.length || 0}</p>
          </div>

          {/* Bookmark ✅ FIXED */}
          <div>
            {userr?.saveblog?.includes(blogData._id) ? (
              <FaBookmark
                className="cursor-pointer"
                onClick={() => bookmark(blogData._id)}
              />
            ) : (
              <FaRegBookmark
                className="cursor-pointer"
                onClick={() => bookmark(blogData._id)}
              />
            )}
          </div>

          {/* Edit + Delete */}
          {token &&
            blogcreator?.toString() === user?.toString() && (
              <div className="flex gap-5">
                <Link to={`/edit/${blogData.blogId}`}>
                  <MdEdit className="text-2xl cursor-pointer" />
                </Link>
                <MdDelete
                  className="text-2xl cursor-pointer hover:text-red-600"
                  onClick={deletepopup}
                />
              </div>
            )}
        </div>

        {/* Delete Popup */}
        {deletepop && (
          <div className="flex flex-col gap-2">
            <p className="text-2xl">Are you sure you want to delete?</p>
            <div className="flex gap-5">
              <p
                onClick={deleteblog}
                className="border p-2 text-2xl text-white bg-black rounded-xl cursor-pointer"
              >
                Yes
              </p>
              <p
                onClick={deletepopup}
                className="border p-2 text-2xl text-white bg-black rounded-xl cursor-pointer"
              >
                No
              </p>
            </div>
          </div>
        )}

        {/* Tags ✅ FIXED */}
        <div className="flex gap-2 flex-wrap">
          {tags.map((item, index) => (
            <Link key={index} to={`/search/${item}`}>
              <p className="border-2 p-2 rounded-2xl text-[15px] bg-black text-white font-bold cursor-pointer">
                #{item}
              </p>
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="border-t pt-4">
          {blogData.content?.blocks?.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                  className="my-4"
                ></p>
              );
            }

            if (block.type === "header") {
              const levels = {
                2: "text-4xl",
                3: "text-3xl",
              };
              return (
                <h2
                  key={index}
                  className={`${levels[block.data.level] || "text-2xl"} my-4`}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                ></h2>
              );
            }

            if (block.type === "image") {
              return (
                <div key={index} className="my-4">
                  <img src={block.data.file.url} alt="" />
                  <p className="text-center">{block.data.caption}</p>
                </div>
              );
            }
          })}
        </div>
      </div>

      {isOpen && <Comments />}
    </div>
  );
}

export default Blogpage;
