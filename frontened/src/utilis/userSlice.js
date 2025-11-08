import { createSlice } from "@reduxjs/toolkit";

// ✅ Load saved user safely
let savedUser = null;
try {
  savedUser = JSON.parse(localStorage.getItem("user"));
} catch {
  savedUser = null;
}

const initialState = savedUser || {
  token: null,
  saveblog: [],
  following: [],
};

const safeUserForStorage = (user) => {
  const cleaned = { ...user };

  // ✅ Remove File objects (VERY IMPORTANT)
  if (cleaned.profilePic instanceof File) {
    delete cleaned.profilePic;
  }

  return cleaned;
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    login(state, action) {
      const newUser = action.payload;

      const safeUser = safeUserForStorage(newUser);

      localStorage.setItem("user", JSON.stringify(safeUser));

      return safeUser;
    },

    logout() {
      localStorage.removeItem("user");
      return { token: null, saveblog: [], following: [] };
    },

    setsaveblog(state, action) {
      const { blogId } = action.payload;
      if (!state.saveblog) state.saveblog = [];

      const alreadySaved = state.saveblog.includes(blogId);

      if (alreadySaved) {
        state.saveblog = state.saveblog.filter((id) => id !== blogId);
      } else {
        state.saveblog.push(blogId);
      }

      // ✅ Save cleaned version
      localStorage.setItem("user", JSON.stringify(safeUserForStorage(state)));
    },

    followuser(state, action) {
      const { id } = action.payload;
      if (!state.following) state.following = [];

      const already = state.following.includes(id);

      if (already) {
        state.following = state.following.filter((f) => f !== id);
      } else {
        state.following.push(id);
      }

      // ✅ Save cleaned version
      localStorage.setItem("user", JSON.stringify(safeUserForStorage(state)));
    },
  },
});

export const { login, logout, setsaveblog, followuser } = userSlice.actions;
export default userSlice.reducer;
