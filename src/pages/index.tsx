import Image from "next/image";
import { Geist, Geist_Mono, Cherry_Bomb_One } from "next/font/google";
import { useEffect, useState } from "react";
import { DBMovie, getTodaysMovie } from "@/lib/movies";
import { celebrate } from "@/utils/confetti";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import WinLoseModal from "@/components/WinLoseModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cherryBombOne = Cherry_Bomb_One({ weight: "400", subsets: ["latin"] });

interface Movie {
  Title: string;
  Year: string;
}

export const getStaticProps = async () => {
  const movie = await getTodaysMovie();
  return {
    props: { dailyMovie: movie ?? null },
    revalidate: 60 * 60 * 24, // 24h safety; on-demand revalidation will update sooner
  };
};

export default function Home({ dailyMovie }: { dailyMovie: DBMovie | null }) {
  const [value, setValue] = useState("");
  const [movies, setMovies] = useState([]);
  const [matchedMovies, setMatchedMovies] = useState([]);
  const [guesses, setGuesses] = useState<Movie[]>([]);
  const [lives, setLives] = useState<string[]>(["❤️", "❤️", "❤️"]); // 3 lives
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [parent] = useAutoAnimate({ duration: 1000, easing: "ease-in-out" });
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"win" | "lose">("win");

  console.log(dailyMovie);

  const fetchMovies = async () => {
    const res = await fetch("/movies.json");
    const movies = await res.json();
    setMovies(movies);
  };

  const handleInputChange = (event: { target: { value: any } }) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    // If the input is empty, reset matchedMovies to show all movies
    if (inputValue.trim() === "") {
      setMatchedMovies([]);
      return;
    }

    // Filter movies based on the input value
    const filteredMovies = movies.filter((movie: { Title: string; Year: string }) => movie.Title.toLowerCase().includes(inputValue.toLowerCase()));
    setMatchedMovies(filteredMovies);
  };

  const handleMovieClick = (movie: Movie) => {
    handleInputChange({ target: { value: movie.Title } });
    if (movie.Title.toLowerCase().trim() === (dailyMovie?.title || "").toLowerCase().trim()) {
      celebrate(); // Trigger confetti celebration
      setValue(""); // Clear input on correct guess
      setMatchedMovies([]); // Clear matched movies
      onCorrectGuess();
    } else {
      // If the guess is incorrect, reduce lives
      setLives((prevLives) => {
        const newLives = [...prevLives];
        newLives.pop(); // Remove one life
        return newLives;
      });
      if (lives.length <= 1) {
        onOutOfGuesses();
      }
      setGuesses((prevGuesses) => [...prevGuesses, movie]);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  function onCorrectGuess() {
    setStatus("win");
    setModalOpen(true);
  }
  function onOutOfGuesses() {
    setStatus("lose");
    setModalOpen(true);
  }

  // Fetch movies from the JSON file
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <header className="w-full flex items-baseline justify-between">
        <h1 className={`${cherryBombOne.className} font-sans text-3xl`}>moviemoji</h1>
        <div className="flex items-center gap-2">
          {lives.map((heart, index) => (
            <span key={index} className="text-2xl">
              {heart}
            </span>
          ))}
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div>
          {dailyMovie?.emojis.map((emoji, index) => (
            <h2 key={index} className="text-5xl sm:text-6xl md:text-7xl inline-block px-5">
              {emoji}
            </h2>
          ))}
        </div>
        <div className="inline-block w-full sm:w-[400px] md:w-[500px] lg:w-[600px]">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            aria-expanded={showHint}
            aria-controls="hint-panel"
            className="bg-amber-50 py-2 px-5 rounded-t-2xl border border-amber-400 cursor-pointer text-sm font-medium w-full"
          >
            {showHint ? "Hide hint" : "💡 Show hint"}
          </button>
          <div
            className={[
              "grid transition-[grid-template-rows] duration-250 ease-out",
              "motion-reduce:transition-none",
              showHint ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            ].join(" ")}
          >
            <div
              id="hint-panel"
              className={[
                "overflow-hidden", // required for the grid-rows trick
                "opacity-0 transition-opacity duration-200 ease-out",
                showHint ? "opacity-100" : "opacity-0",
                "rounded-b-2xl border-b border-x border-amber-300 bg-amber-50/70 px-4 py-3 text-sm text-amber-900",
              ].join(" ")}
            >
              {dailyMovie?.hint ?? "No hint available."}
            </div>
          </div>
        </div>
        <input
          className={`w-full sm:w-[400px] md:w-[500px] lg:w-[600px] h-10 sm:h-12 px-4 sm:px-5 rounded-full border border-solid border-black/[.08] bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-black transition-colors ${
            isShaking ? "animate-playful-shake" : ""
          }`}
          type="text"
          placeholder="Search for a movie or emoji..."
          value={value}
          onChange={handleInputChange}
        />
        <div className="flex flex-wrap gap-2">
          {guesses.map((guess, index) => (
            <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-300 transition-colors">
              ❌ {guess.Title} ({guess.Year})
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full sm:w-[400px] md:w-[500px] lg:w-[600px]">
          {value.trim() !== "" &&
            (matchedMovies.length > 0 ? (
              matchedMovies.map((movie: Movie, index: number) => (
                <button
                  key={index}
                  className="p-4 border border-solid border-black/[.08] rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={guesses.some((g) => g.Title.toLowerCase() === movie.Title.toLowerCase())}
                  onClick={() => handleMovieClick(movie)}
                >
                  <h3 className="text-xl font-semibold">{movie.Title}</h3>
                  <p className="text-gray-600">Year: {movie.Year}</p>
                </button>
              ))
            ) : (
              <p className="text-gray-500">No movies found</p>
            ))}
        </div>
        <WinLoseModal
          open={modalOpen}
          status={status}
          dailyMovie={dailyMovie ?? undefined}
          onClose={() => setModalOpen(false)}
          onPlayAgain={() => {
            setModalOpen(false);
            // reset input / fetch next / route, etc.
          }}
        />
      </main>
    </div>
  );
}
