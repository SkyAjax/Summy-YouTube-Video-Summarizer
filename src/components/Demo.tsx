import React, { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick, copyLink, open } from "../assets";
import { useLazyGetTranscriptionQuery } from "../services/video";
import OpenAI from "openai";
import { summaryPrompt } from "../utils/promts";
import Tooltip from "../Tooltip";

const Demo = () => {
  const [video, setVideo] = useState({
    url: "",
    videoId: "",
    summary: "",
    title: "",
    thumbnails: [],
  });

  const [allVideos, setAllVideos] = useState<
    {
      title: string;
      thumbnails: [];
      summary: string;
      url: string;
      videoId: string;
    }[]
  >([]);

  const [formState, setFormState] = useState({ url: "", error: "" });

  const [isLoading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const videosFromLocalStorage = JSON.parse(
      localStorage.getItem("videos") ?? "[]"
    );
    if (videosFromLocalStorage) {
      setAllVideos(videosFromLocalStorage);
    }
  }, []);

  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: openAiKey,
    dangerouslyAllowBrowser: true,
  });

  interface ITimestamp {
    start: number;
    dur: number;
    subtitle: string;
  }

  const getCleanTranscription = (transcription: ITimestamp[]): string => {
    let result = ``;
    transcription.forEach((timestamp: ITimestamp) => {
      if ("subtitle" in timestamp) {
        result += ` ${timestamp.subtitle}`;
      }
    });
    return result;
  };

  const createSummary = async (transcription: string) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: summaryPrompt },
          { role: "user", content: transcription },
        ],
        temperature: 0.3,
      });
      return completion.choices[0].message.content;
    } catch (e) {
      setLoading(false);
      setFormState({
        ...formState,
        error: "This video is too long for me for now",
      });
      console.error(e);
      throw new Error("Error creating summary");
    }
  };

  const [getTranscription, { error, isFetching }] =
    useLazyGetTranscriptionQuery();

  const getVideoId = (stringUrl: string) => {
    const url = new URL(stringUrl);
    if (url.hostname === "www.youtube.com") {
      const urlParams = url.searchParams;
      return urlParams.get("v");
    } else {
      const [, videoId] = url.pathname.split("/");
      return videoId;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const existingSummary = allVideos.find(
      (v) => v.videoId === getVideoId(formState.url)
    );
    if (!existingSummary) {
      setLoading(true);
      try {
        const { data } = await getTranscription({
          video_id: getVideoId(formState.url),
        });
        if (data) {
          const cleanTranscription = getCleanTranscription(
            data[0].transcription
          );
          const generatedSummary = await createSummary(cleanTranscription);
          const newSummary = {
            url: formState.url,
            videoId: getVideoId(formState.url) || "",
            title: data[0].title,
            thumbnails: data[0].thumbnails,
            summary: generatedSummary || "",
          };

          setVideo(newSummary);
          const updatedAllVideos = [newSummary, ...allVideos];
          setAllVideos(updatedAllVideos);
          setFormState({ url: "", error: "" });
          localStorage.setItem("videos", JSON.stringify(updatedAllVideos));
        }
      } catch (e) {
        setLoading(false);
        setFormState({
          ...formState,
          error: "Can't summarize video at this time. Try other ones",
        });
        console.error(e);
      }
    } else {
      setFormState({
        ...formState,
        error: "Summary for this video already exists",
      });
    }
    setLoading(false);
  };

  const handleCopy = (copyUrl: string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  const handleOpen = (url: string) => {
    window.open(url, "_blank");
  };

  const normalizeSummary = (summary: string | null) => {
    if (!summary) return;
    try {
      const obj = JSON.parse(summary);
      return (
        <ul>
          {obj.Summary.map((point, index: number) => {
            return (
              <li key={`summary-${index}`} className="mb-3">
                <span>{point["emoji"]} </span>
                {point["point"]}
              </li>
            );
          })}
        </ul>
      );
    } catch (e) {
      return <p>{summary}</p>;
    }
  };

  return (
    <section className="mt-16 w-full max-x-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          onSubmit={handleSubmit}
          className="relative flex justify-center items-center"
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter URL"
            value={formState.url}
            onChange={(e) => setFormState({ error: "", url: e.target.value })}
            required
            className="url_input peer"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
            disabled={isLoading}
          >
            ↵
          </button>
        </form>
        {formState.error ? (
          <div className="w-full bg-red-400 rounded-md bg-opacity-40 transition-opacity ease-in">
            <p className="py-2 px-3">{formState.error}</p>
          </div>
        ) : (
          <></>
        )}
        <div
          id="wrapper"
          className="flex flex-col lg:flex-row my-10 justify-between gap-x-3"
        >
          {/* DISPLAY RESULT */}
          <div className="flex basis-1/2 justify-center">
            {isLoading ? (
              <img
                src={loader}
                alt="loader"
                className="w-20 h-20 object-contain"
              />
            ) : error ? (
              <p className="font-inter font-bold text-black text-center">
                Can't summarize this video... Sorry bout that
              </p>
            ) : (
              video.summary && (
                <div className="flex flex-col gap-3">
                  <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                    Video <span className="blue_gradient">Summary</span>
                  </h2>
                  <div className="summary_box">
                    <div className="font-inter font-medium text-sm text-gray-700">
                      {normalizeSummary(video.summary)}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {/* HISTORY */}
          <div className="flex flex-col">
            {allVideos.length > 0 ? (
              <>
                <h2 className="font-satoshi font-bold text-gray-600 text-xl mb-3">
                  <span className="blue_gradient">History</span>
                </h2>
                <div className="h-96 overflow-auto">
                  {allVideos.map((item, index) => (
                    <div
                      key={`link-${index}`}
                      onClick={() => setVideo(item)}
                      className={`link_card overflow-hidden max-h-20 mb-2 hover:bg-gray-100  ${
                        video.url === item.url ? "active" : "inactive"
                      }`}
                    >
                      <div className="block">
                        <Tooltip
                          content={"Copy Link"}
                          children={
                            <div
                              className="copy_btn mb-2"
                              onClick={() => handleCopy(item.url)}
                            >
                              <img
                                src={copied === item.url ? tick : copy}
                                alt="copy_icon"
                                className="w-[40%] h-[40%] object-contain"
                              />
                            </div>
                          }
                        ></Tooltip>
                        <Tooltip
                          content={"Open Video"}
                          children={
                            <div
                              className="copy_btn"
                              onClick={() => handleOpen(item.url)}
                            >
                              <img
                                src={open}
                                alt="open_icon"
                                className="w-[40%] h-[40%] object-contain"
                              />
                            </div>
                          }
                        ></Tooltip>
                      </div>
                      <img
                        src={item.thumbnails[4].url}
                        alt="video_thumbnail"
                        className="rounded-lg"
                        width="120px"
                      />
                      <p className="font-satoshi text-blue-700 font-medium text-xs">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
