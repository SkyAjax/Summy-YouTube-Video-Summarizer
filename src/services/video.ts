import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rapidApiKey = import.meta.env.VITE_RAPID_API_VIDEO_KEY;
console.log(rapidApiKey);

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://youtube-transcriptor.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set("X-RapidAPI-Host", "youtube-transcriptor.p.rapidapi.com");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTranscription: builder.query({
      query: (params) => `transcript?video_id=${params.video_id}`,
    }),
  }),
});

export const { useLazyGetTranscriptionQuery } = videoApi;
