import { createSlice } from "@reduxjs/toolkit";

export const blogSlice = createSlice({
  name: "blogSlice",
  initialState: JSON.parse(localStorage.getItem("blog") || "{}") || {},

  reducers: {
    // ✅ Set or update entire blog
    addblog(state, action) {
      localStorage.setItem("blog", JSON.stringify(action.payload));
      return action.payload;
    },

    // ✅ Clear blog data
    removeblog() {
      localStorage.setItem("blog", JSON.stringify({}));
      return {};
    },

    // ✅ Add top-level comment
    addcomment(state, action) {
      if (state.comments) {
        state.comments = [action.payload, ...state.comments];
      } else {
        state.comments = [action.payload];
      }
    },

    // ✅ Toggle like on comment
    addcommentlike(state, action) {
      const { commentId, userId } = action.payload;
      const comment = state.comments?.find((c) => c._id === commentId);

      if (comment) {
        if (comment.likes.includes(userId)) {
          comment.likes = comment.likes.filter((like) => like !== userId);
        } else {
          comment.likes.push(userId);
        }
      }
    },
     
  
 setUpdatedComments(state, action) {
  const { id, commentedit } = action.payload;

  function updateCommentList(comments) {
    return comments.map((comment) => {
      if (comment._id === id) {
        // update top-level comment
        return { ...comment, comment: commentedit };
      }
      if (comment.replies && comment.replies.length > 0) {
        // recursively update nested replies
        return { 
          ...comment, 
          replies: updateCommentList(comment.replies) 
        };
      }
      return comment;
    });
  }

  if (state.comments && state.comments.length > 0) {
    state.comments = updateCommentList(state.comments);
  }
},


deleteComment(state,action)
{
  const {id}=action.payload
  console.log(id);
  
  function deletee(comments)
  {
    const comment=comments.filter((comm)=>(comm._id!=id))
    return comment
  }
  if(state.comments&&state.comments.length>0)
  {
    state.comments=deletee(state.comments)
  }
}

   
 
  },
});

export const {
  addblog,
  removeblog,
  addcomment,
  addcommentlike,
  setReplies,
  setUpdatedComments,
  deleteComment
} = blogSlice.actions;

export default blogSlice.reducer;
