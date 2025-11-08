import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { login } from "../utilis/userSlice";
import { useNavigate } from "react-router-dom";

function Editprofile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  const { bio, profilePic, name, username, showlike, showsave, token, id } =
    userData;

  const [newuserdata, setuserdata] = useState({
    bio: bio || "",
    name: name || "",
    username: username || "",
    showlike: showlike ?? true,
    showsave: showsave ?? true,
    profilePicFile: null,        // ✅ FILE stored separately
    profilePicPreview: profilePic || "", // ✅ Preview only
  });

  const [loading, setLoading] = useState(false);
  const [removePic, setRemovePic] = useState(false);

  // ✅ Remove image
  const handleRemove = () => {
    setuserdata((prev) => ({
      ...prev,
      profilePicPreview: "",
      profilePicFile: null,
    }));
    setRemovePic(true);

    const fileInput = document.getElementById("image");
    if (fileInput) fileInput.value = "";
  };

  // ✅ Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setuserdata((prev) => ({
        ...prev,
        profilePicFile: file,
        profilePicPreview: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserdata((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newuserdata.name);
    formData.append("username", newuserdata.username);
    formData.append("bio", newuserdata.bio);
    formData.append("removePic", removePic);
    formData.append("showlike", newuserdata.showlike);
    formData.append("showsave", newuserdata.showsave);

    // ✅ Only append file
    if (newuserdata.profilePicFile) {
      formData.append("profilePic", newuserdata.profilePicFile);
    }

    try {
      setLoading(true);

      const res = await axios.patch(
        `${import.meta.env.VITE_BACKENED_URL}/editprofile/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated ✅");

        dispatch(
          login({
            ...res.data.user,
            id: res.data.user._id,
            token,
          })
        );

        navigate(`/profile/${res.data.user.username}`);
      } else {
        toast.error(res.data.message || "Update failed ❌");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-center p-4 w-full max-w-md mx-auto"
    >
      {/* Profile Image */}
      <div className="w-[150px] h-[150px] cursor-pointer rounded-full overflow-hidden">
        <label htmlFor="image" className="cursor-pointer">
          {newuserdata.profilePicPreview ? (
            <img
              src={newuserdata.profilePicPreview}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-white border-2 border-dashed rounded-full flex justify-center items-center">
              Select Image
            </div>
          )}
        </label>
        <input
          id="image"
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <p
        className="border-2 p-1 px-3 rounded-xl bg-black text-white cursor-pointer"
        onClick={handleRemove}
      >
        Remove
      </p>

      {/* Inputs */}
      <input
        type="text"
        name="name"
        value={newuserdata.name}
        onChange={handleChange}
        className="border p-2 rounded-lg w-full"
        placeholder="Full Name"
      />

      <input
        type="text"
        name="username"
        value={newuserdata.username}
        onChange={handleChange}
        className="border p-2 rounded-lg w-full"
        placeholder="Username"
      />

      <textarea
        name="bio"
        value={newuserdata.bio}
        onChange={handleChange}
        className="border p-2 rounded-lg w-full"
        rows="3"
        placeholder="Write your bio"
      />

      {/* Show Like */}
      <label className="text-xl">Show Liked Blogs</label>
      <select
        value={newuserdata.showlike}
        onChange={(e) =>
          setuserdata((prev) => ({
            ...prev,
            showlike: e.target.value === "true",
          }))
        }
        className="border p-2 rounded-lg w-40"
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>

      {/* Show Save */}
      <label className="text-xl">Show Saved Blogs</label>
      <select
        value={newuserdata.showsave}
        onChange={(e) =>
          setuserdata((prev) => ({
            ...prev,
            showsave: e.target.value === "true",
          }))
        }
        className="border p-2 rounded-lg w-40"
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default Editprofile;
