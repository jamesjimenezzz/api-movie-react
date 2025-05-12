import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "4ff09d0b";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function addWatchedMovie(newWatchedMovie) {
    setWatched((watched) => [...watched, newWatchedMovie]);
  }

  function handleSelectId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function removeId(id) {
    setWatched((watched) => watched.filter((watch) => watch.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          if (!query) {
            setMovies([]);
            setError("");
            return;
          }
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("No movies found");
          console.log(data);

          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message || "Something went wrong");
          }
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  console.log(movies);

  return (
    <>
      <NavBar>
        <Logo />
        <SearchInput query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectId={handleSelectId} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              addWatchedMovie={addWatchedMovie}
              setSelectedId={setSelectedId}
              watched={watched}
            />
          ) : (
            <>
              <WatchedMoviesList
                watched={watched}
                setSelectedId={setSelectedId}
                removeId={removeId}
              />
              <UlWatchedMovieList
                watched={watched}
                handleSelectId={handleSelectId}
                removeId={removeId}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <p className="error"> {message}</p>;
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchInput({ query, setQuery }) {
  function InputSubmit(e) {
    e.preventDefault();
    setQuery("");
  }

  return (
    <form onSubmit={InputSubmit}>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button>Submit</button>
    </form>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// MAIN PART // MAIN PART // MAIN PART

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectId={handleSelectId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectId }) {
  return (
    <li onClick={() => handleSelectId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

/*
function MoviesWatched() {
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedMoviesList watched={watched} />
          <UlWatchedMovieList watched={watched} />
        </>
      )}
    </div>
  );
}

*/

function WatchedMoviesList({ watched }) {
  const avgImdbRating = Number(
    average(watched.map((movie) => movie.imdbRating)).toFixed(1)
  );
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(1);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(1);

  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  );
}

function UlWatchedMovieList({ watched, handleSelectId, removeId }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieList
          movie={movie}
          key={movie.imdbID}
          handleSelectId={handleSelectId}
          removeId={removeId}
        />
      ))}
    </ul>
  );
}

function SelectedMovie({
  selectedId,
  addWatchedMovie,
  setSelectedId,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );

        const data = await res.json();
        console.log(data);
        setIsLoading(false);
        setMovie(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie || ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  function handleWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: parseInt(runtime),
      userRating,
    };

    console.log(newWatchedMovie);
    addWatchedMovie(newWatchedMovie);
    setSelectedId(null);
  }

  useEffect(
    function () {
      function handleKeyDown(e) {
        if (e.key === "Escape") {
          setSelectedId(null);
        }
      }
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [setSelectedId]
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isWatched ? (
                <p>You've already watched this</p>
              ) : (
                <StarRating
                  maxRating={10}
                  size={24}
                  onTestRate={setUserRating}
                />
              )}

              {userRating > 0 && (
                <button className="btn-add" onClick={handleWatched}>
                  + Add to list
                </button>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>
              Directed by: <b>{director}</b>
            </p>
          </section>
          {selectedId}
        </div>
      )}
    </>
  );
}

function WatchedMovieList({ movie, handleSelectId, removeId }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <p>
          <span>
            <button
              className="btn-delete"
              onClick={() => removeId(movie.imdbID)}
            >
              X
            </button>
          </span>
        </p>
      </div>
    </li>
  );
}
