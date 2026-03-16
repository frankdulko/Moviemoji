import { Geist, Geist_Mono, Cherry_Bomb_One } from "next/font/google";
import { useEffect, useState } from "react";
import { DBMovie, getOrPickTodaysMovie } from "@/lib/movies";
import { celebrate } from "@/utils/confetti";
import WinLoseModal from "@/components/WinLoseModal";
import HintPanel from "@/components/HintPanel";

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
  title: string;
  year: string;
}

export const getServerSideProps = async () => {
  try {
    const dailyMovie = await getOrPickTodaysMovie();
    return { props: { dailyMovie, error: null } };
  } catch (err) {
    console.error("[getServerSideProps] Failed to get today's movie:", err);
    return { props: { dailyMovie: null, error: "no_puzzle" } };
  }
};

export default function Home({
  dailyMovie,
  error,
}: {
  dailyMovie: DBMovie | null;
  error: string | null;
}) {
  const [value, setValue] = useState("");
  const [movies, setMovies] = useState([]);
  const [matchedMovies, setMatchedMovies] = useState([]);
  const [guesses, setGuesses] = useState<Movie[]>([]);
  const [lives, setLives] = useState<string[]>(["❤️", "❤️", "❤️"]); // 3 lives
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"win" | "lose">("win");

  const fetchMovies = async () => {
    const res = await fetch("/movies.json");
    const movies = await res.json();
    setMovies(movies);
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    // If the input is empty, reset matchedMovies to show all movies
    if (inputValue.trim() === "") {
      setMatchedMovies([]);
      return;
    }

    // Filter movies based on the input value
    const filteredMovies = movies.filter((movie: Movie) => movie.title.toLowerCase().includes(inputValue.toLowerCase()));
    setMatchedMovies(filteredMovies);
  };

  const handleMovieClick = (movie: Movie) => {
    handleInputChange({ target: { value: '' } });
    if (movie.title.toLowerCase().trim() === puzzle.title.toLowerCase().trim()) {
      celebrate(); // Trigger confetti celebration
      setValue(""); // Clear input on correct guess
      setMatchedMovies([]); // Clear matched movies
      onCorrectGuess();
    } else {
      setLives((prevLives) => {
        const newLives = prevLives.slice(0, -1);
        if (newLives.length === 0) onOutOfGuesses();
        return newLives;
      });
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

  if (!dailyMovie) {
    return (
      <div
        className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-12 gap-12 sm:p-12`}
      >
        <header className="w-full flex items-baseline justify-between">
          <h1 className={`${cherryBombOne.className} font-sans text-3xl`}>moviemoji</h1>
        </header>
        <main className="flex flex-col gap-6 row-start-2 items-center justify-center text-center">
          <p className="text-lg text-muted-foreground">
            No puzzle right now. We&apos;ll have a new one soon.
          </p>
          <p className="text-sm text-muted-foreground">Check back later or refresh the page.</p>
        </main>
      </div>
    );
  }

  const puzzle = dailyMovie;

  return (
    <div
        className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-12 gap-12 sm:p-12`}
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
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-[600px]">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Today&apos;s puzzle
        </p>
        <p className="text-lg font-medium text-center">Guess the movie from the emojis.</p>
        <div className="w-full rounded-2xl border border-black/[.06] bg-black/[.02] px-6 py-8 sm:px-8 sm:py-10 flex flex-wrap justify-between">
          {puzzle.emojis.map((emoji, index) => (
            <span key={index} className="text-5xl sm:text-6xl md:text-7xl leading-none">
              {emoji}
            </span>
          ))}
        </div>
        {guesses.length >= 1 && (
          <HintPanel
            hint={puzzle.hint}
            open={showHint}
            onToggle={() => setShowHint((prev) => !prev)}
          />
        )}
        <input
          className={`w-full h-10 sm:h-12 px-4 sm:px-5 rounded-full border border-solid border-black/[.08] bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-black transition-colors ${
            isShaking ? "animate-playful-shake" : ""
          }`}
          type="text"
          placeholder="Search for a movie..."
          value={value}
          onChange={handleInputChange}
        />
        {guesses.length > 0 && <div className="flex flex-wrap gap-2 justify-center w-full">
          {guesses.map((guess, index) => (
            <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-300 transition-colors">
              ❌ {guess.title} ({guess.year})
            </span>
          ))}
        </div>}
        <div className="flex flex-col gap-4 w-full">
          {value.trim() !== "" &&
            (matchedMovies.length > 0 ? (
              matchedMovies.map((movie: Movie, index: number) => (
                <button
                  key={index}
                  className="p-4 border border-solid border-black/[.08] rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={guesses.some((g) => g.title.toLowerCase() === movie.title.toLowerCase())}
                  onClick={() => handleMovieClick(movie)}
                >
                  <h3 className="text-xl font-semibold">{movie.title}</h3>
                  <p className="text-gray-600">Year: {movie.year}</p>
                </button>
              ))
            ) : (
              <p className="text-gray-500">No movies found</p>
            ))}
        </div>
        <WinLoseModal
          open={modalOpen}
          status={status}
          dailyMovie={puzzle}
          winStats={
            status === "win"
              ? { livesLeft: lives.length, wrongGuesses: guesses.length, hintUsed: showHint }
              : undefined
          }
        />
      </main>
    </div>
  );
}
