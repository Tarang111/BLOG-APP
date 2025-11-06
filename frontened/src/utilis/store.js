import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import  blogSlice  from './blogSlice'
import commentSlice from './commentSlice'
export const store = configureStore({
  reducer: {
     user:userSlice,
     blog:blogSlice,
     comment:commentSlice
  },
})
export default store