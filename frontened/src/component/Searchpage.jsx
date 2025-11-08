import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiTwotoneLike } from "react-icons/ai";
import { MdOutlineComment } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

function Searchpage() {
  const { keyword } = useParams();
  const userr = useSelector(slice => slice.user);
  const [data, setdata] = useState([]);
  const [page, setpage] = useState(1);
  const [hasmore, setmore] = useState(true);

  async function handleserached() {
    try {
      const params = { page, limit: 5 };
      const res = await axios.get(
        `${import.meta.env.VITE_BACKENED_URL}/searchblog/${keyword}`,
        { params }
      );

      setdata(prev => [...prev, ...res.data.blog]);
      setmore(res.data.hasmore);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setpage(1);
    setdata([]);
    handleserached();
  }, [keyword]);

  useEffect(() => {
    if (page !== 1) handleserached();
  }, [page]);

  return (
    <>
      <h1 className="text-center text-2xl font-bold">
        <span className="text-3xl text-gray-400">Search Result for :- </span>
        {keyword}
      </h1>

      <div className="md:w-[60%] w-[100%] mx-auto mt-2 mb-2 md:p-0 p-2 flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((blog) => {
            const tags = blog?.tags?.[0]?.split(",") || []; // ✅ SAFE TAGS

            return (
              <Link to={`/blog/${blog.blogId}`} key={blog.blogId}>
                <div className="flex md:flex-row flex-col w-[100%] gap-15 min-h-[35vh] rounded-sm border-2 p-2 justify-between">

                  {/* LEFT SIDE */}
                  <div className="flex flex-col md:w-[50%] w:[100%] gap-4">
                    {/* USER */}
                    <div className="flex rounded-full items-center gap-1">
                      <img
                        src={
                          blog.creator.profilePic
                            ? blog.creator.profilePic
                            : `https://api.dicebear.com/9.x/initials/svg?seed=${blog.creator.name}`
                        }
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                      <p>{blog.creator.name}</p>
                    </div>

                    {/* TITLE */}
                    <h2 className="font-bold text-3xl">{blog.title}</h2>

                    {/* DESCRIPTION */}
                    <h4 className="font-light line-clamp-4">
                      {blog.description}
                    </h4>

                    {/* TIME + LIKE + COMMENT + BOOKMARK */}
                    <div className="flex items-center gap-8">
                      <p>{blog.createdAt.slice(0, 10)}</p>

                      <div className="flex items-center gap-1">
                        <AiTwotoneLike className="text-[20px]" />
                        <p>{blog.likes?.length || 0}</p>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <MdOutlineComment className="text-[20px]" />
                        <p>{blog.comments?.length || 0}</p>
                      </div>

                      {/* BOOKMARK ✅ SAFE CHECK */}
                      <div>
                        {userr?.saveblog?.includes(blog._id) ? (
                          <FaBookmark className="cursor-pointer" />
                        ) : (
                          <FaRegBookmark className="cursor-pointer" />
                        )}
                      </div>
                    </div>

                    {/* TAGS ✅ SAFE CHECK */}
                    <div className="flex gap-2 w-[90%] overflow-hidden">
                      {tags.map((item, index) => (
                        <p
                          key={index}
                          className="border-2 p-2 w-fit rounded-2xl text-[10px] flex justify-center items-center gap-2 bg-black text-white font-bold hover:bg-gray-400"
                        >
                          #{item}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT SIDE IMAGE */}
                  <div className="h-full flex justify-center items-center W-[40%]">
                    <img
                      className="w-full h-full max-h-[250px] hover:scale-102 object-cover rounded-md"
                      src={blog.image}
                      alt=""
                    />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <h1 className="text-2xl text-center">No Blog found for this search</h1>
        )}

        {/* LOAD MORE */}
        {hasmore && (
          <button
            className="border-2 p-1.5 w-fit mx-auto rounded-2xl text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500"
            onClick={() => setpage((prev) => prev + 1)}
          >
            Load more
          </button>
        )}
      </div>
    </>
  );
}

export default Searchpage;
