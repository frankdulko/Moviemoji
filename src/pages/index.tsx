import Image from "next/image";
import { Geist, Geist_Mono, Cherry_Bomb_One } from "next/font/google";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [value, setValue] = useState("");
  const [movies, setMovies] = useState([]);
  const [matchedMovies, setMatchedMovies] = useState([]);
  const [guesses, setGuesses] = useState<Movie[]>([]);

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
    setGuesses((prevGuesses) => [...prevGuesses, movie]);
  };

  // Fetch movies from the JSON file
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <header className="w-full">
        <h1 className={`${cherryBombOne.className} font-sans text-3xl`}>moviemoji</h1>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h2 className="text-5xl sm:text-6xl md:text-7xl text-center">😂 🥶 👽 😽 👺</h2>
        <input
          className="w-full sm:w-[400px] md:w-[500px] lg:w-[600px] h-10 sm:h-12 px-4 sm:px-5 rounded-full border border-solid border-black/[.08] bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-black transition-colors"
          type="text"
          placeholder="Search for a movie or emoji..."
          value={value}
          onChange={handleInputChange}
        />
        <div className="flex flex-wrap gap-2">
          {guesses.map((guess, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-300 transition-colors"
              onClick={() => handleMovieClick(guess)}
            >
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
                  className="p-4 border border-solid border-black/[.08] rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
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
      </main>
    </div>
  );
}
