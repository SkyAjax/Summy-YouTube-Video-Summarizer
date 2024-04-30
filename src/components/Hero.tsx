import { summyLogo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <img src={summyLogo} alt="summy_logo" className="w-28 object-contain" />
        <button
          className="black_btn"
          type="button"
          onClick={() => window.open("https://github.com/skyajax")}
        >
          GitHub
        </button>
      </nav>

      <h1 className="head_text">
        Summarize Videos with <br className="max-md:hidden" />
        <span className="orange_gradient">OpenAI GPT-4</span>
      </h1>
      <h2 className="desc">
        Don't waste your time watching long and boring videos on YouTube. With{" "}
        <span className="orange_gradient font-bold"> Summy</span> you can get
        the summarized info about the content of the video with just one click.
      </h2>
    </header>
  );
};

export default Hero;
