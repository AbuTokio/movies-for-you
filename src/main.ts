import "./style.css"
import { MOVIE, movies, SORT } from "./movies.ts"

const searchInputElement = document.querySelector("#search-input") as HTMLInputElement
const searchButton = document.querySelector("#search-btn") as HTMLButtonElement
const yearUpButton = document.querySelector("#year-up-btn") as HTMLButtonElement
const yearDownButton = document.querySelector("#year-down-btn") as HTMLButtonElement
const bestRateButton = document.querySelector("#best-rate-btn") as HTMLButtonElement
const resultCountElement = document.querySelector(".result-count p") as HTMLParagraphElement
const movieDbElement = document.querySelector(".movie-db-section") as HTMLDivElement

function showMovies(data: [string, string, string, string, string[], string][] | undefined) {
  if (data) {
    resultCountElement.textContent = "Found " + data.length + " results"
    data.forEach((movie) => {
      const movieContainer: HTMLDivElement = document.createElement("div")
      const movieTitleElement: HTMLHeadingElement = document.createElement("h2")
      const movieYearElement: HTMLParagraphElement = document.createElement("p")
      const movieDirectorElement: HTMLHeadingElement = document.createElement("h3")
      const movieDurationElement: HTMLParagraphElement = document.createElement("p")
      const movieGenresElement: HTMLDivElement = document.createElement("div")
      const movieRatingElement: HTMLParagraphElement = document.createElement("p")

      movieTitleElement.textContent = movie[MOVIE.TITLE]
      movieYearElement.textContent = movie[MOVIE.YEAR]
      movieDirectorElement.textContent = movie[MOVIE.DIRECTOR]
      movieDurationElement.textContent = movie[MOVIE.DURATION]
      movie[MOVIE.GENRES].forEach((genre) => {
        const movieGenreElement: HTMLParagraphElement = document.createElement("p")
        movieGenreElement.textContent = genre
        movieGenresElement.appendChild(movieGenreElement)
      })
      movieRatingElement.textContent = "⭐ " + movie[MOVIE.RATING]

      movieContainer.appendChild(movieTitleElement)
      movieContainer.appendChild(movieYearElement)
      movieContainer.appendChild(movieDirectorElement)
      movieContainer.appendChild(movieDurationElement)
      movieContainer.appendChild(movieGenresElement)
      movieContainer.appendChild(movieRatingElement)

      movieDbElement.appendChild(movieContainer)
    })
  } else {
    const notFoundContainer: HTMLDivElement = document.createElement("div")
    const notFoundElement: HTMLHeadingElement = document.createElement("h2")

    notFoundElement.textContent = "Movie not found..."
    notFoundContainer.appendChild(notFoundElement)
    movieDbElement.appendChild(notFoundContainer)
  }
}

showMovies(movies)

function filteredMovieDB(str: string): [string, string, string, string, string[], string][] | undefined {
  const moviesFilteredByTitle: [string, string, string, string, string[], string][] = movies.filter(
    (movie: [string, string, string, string, string[], string]) =>
      movie[MOVIE.TITLE].toLowerCase().includes(str.toLowerCase())
  )
  const moviesFilteredByYear: [string, string, string, string, string[], string][] = movies.filter(
    (movie: [string, string, string, string, string[], string]) =>
      movie[MOVIE.YEAR].toLowerCase().includes(str.toLowerCase())
  )
  const moviesFilteredByDirector: [string, string, string, string, string[], string][] = movies.filter(
    (movie: [string, string, string, string, string[], string]) =>
      movie[MOVIE.DIRECTOR].toLowerCase().includes(str.toLowerCase())
  )

  if (moviesFilteredByTitle.length >= 1) {
    return moviesFilteredByTitle
  } else if (moviesFilteredByYear.length >= 1) {
    return moviesFilteredByYear
  } else if (moviesFilteredByDirector.length >= 1) {
    return moviesFilteredByDirector
  } else {
    return undefined
  }
}

function sortedMovieDB(sortingCondition: SORT, filteredData?: [string, string, string, string, string[], string][]) {
  const sortedData: [string, string, string, string, string[], string][] = filteredData
    ? [...filteredData]
    : [...movies]
  switch (sortingCondition) {
    case SORT.BY_YEAR_UP:
      return sortedData.sort(
        (
          movieA: [string, string, string, string, string[], string],
          movieB: [string, string, string, string, string[], string]
        ) => Number(movieA[MOVIE.YEAR]) - Number(movieB[MOVIE.YEAR])
      )
      break
    case SORT.BY_YEAR_DOWN:
      return sortedData.sort(
        (
          movieA: [string, string, string, string, string[], string],
          movieB: [string, string, string, string, string[], string]
        ) => Number(movieB[MOVIE.YEAR]) - Number(movieA[MOVIE.YEAR])
      )
      break
    case SORT.BY_RATING:
      return sortedData.sort(
        (
          movieA: [string, string, string, string, string[], string],
          movieB: [string, string, string, string, string[], string]
        ) => Number(movieB[MOVIE.RATING]) - Number(movieA[MOVIE.RATING])
      )
      break
  }
}

function resetMovieDB() {
  if (movieDbElement) {
    while (movieDbElement.firstChild) {
      movieDbElement.removeChild(movieDbElement.firstChild)
    }
  }
}

searchInputElement.addEventListener("keyup", () => {
  resetMovieDB()
  showMovies(filteredMovieDB(searchInputElement.value))
})

searchButton.addEventListener("click", () => {
  resetMovieDB()
  showMovies(filteredMovieDB(searchInputElement.value))
})

yearUpButton.addEventListener("click", () => {
  resetMovieDB()
  searchInputElement.value
    ? showMovies(sortedMovieDB(SORT.BY_YEAR_UP, filteredMovieDB(searchInputElement.value)))
    : showMovies(sortedMovieDB(SORT.BY_YEAR_UP))
})

yearDownButton.addEventListener("click", () => {
  resetMovieDB()
  searchInputElement.value
    ? showMovies(sortedMovieDB(SORT.BY_YEAR_DOWN, filteredMovieDB(searchInputElement.value)))
    : showMovies(sortedMovieDB(SORT.BY_YEAR_DOWN))
})

bestRateButton.addEventListener("click", () => {
  resetMovieDB()
  searchInputElement.value
    ? showMovies(sortedMovieDB(SORT.BY_RATING, filteredMovieDB(searchInputElement.value)))
    : showMovies(sortedMovieDB(SORT.BY_RATING))
})
