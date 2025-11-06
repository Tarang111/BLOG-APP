import { createSlice } from '@reduxjs/toolkit';


export const userSlice = createSlice({
  name: 'userSlice',
  initialState: JSON.parse(localStorage.getItem('user')) || { token: null, saveblog: [] },
  reducers: {
    login(state, action) {
      const newState = action.payload;
      localStorage.setItem('user', JSON.stringify(newState));
      return newState;
    },

    logout() {
      localStorage.removeItem('user',{});
      return {};
    },

    setsaveblog(state, action) {
      const { blogId } = action.payload;
      if (!state.saveblog) state.saveblog = [];

      const alreadySaved = state.saveblog.includes(blogId);

      if (alreadySaved) {
        state.saveblog = state.saveblog.filter((id) => id !== blogId);
        localStorage.setItem('user', JSON.stringify(state));
      } else {
        state.saveblog.push(blogId);
        localStorage.setItem('user', JSON.stringify(state));
      }
    },
    followuser(state,action)
    {
         const { id } = action.payload;
      if (!state.following) state.following = [];

      const alreadyfollowed = state.following.includes(id);

      if (alreadyfollowed) {
        state.following = state.following.filter((item) => item != id);
        localStorage.setItem('user', JSON.stringify(state));
      } else {
        state.following.push(id);
        localStorage.setItem('user', JSON.stringify(state));
      }
    }
  },
});

export const { login, logout, setsaveblog,followuser } = userSlice.actions;
export default userSlice.reducer;
