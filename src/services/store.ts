import { configureStore } from "@reduxjs/toolkit";
import { videoApi } from "./video";

export const store = configureStore({
  reducer: { [videoApi.reducerPath]: videoApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(videoApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
