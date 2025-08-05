import "./style.css"
import { MOVIE, movies, SORT } from "./movies.ts"

const searchInputElement = document.querySelector("#search-input") as HTMLInputElement
// const searchButton = document.querySelector("#search-btn") as HTMLButtonElement
const sortByYearButton = document.querySelector("#year-up-btn") as HTMLButtonElement
const yearDownButton = document.querySelector("#year-down-btn") as HTMLButtonElement
const sortByRatingButton = document.querySelector("#best-rate-btn") as HTMLButtonElement
const resultCountElement = document.querySelector(".result-count p") as HTMLParagraphElement
const movieDbElement = document.querySelector(".movie-db-section") as HTMLDivElement

function showMovies(data: typeof movies | undefined) {
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
      // movieDbElement.classList.remove("movie-not-found")
    })
  } else {
    const notFoundContainer: HTMLDivElement = document.createElement("div")
    const notFoundElement: HTMLHeadingElement = document.createElement("h2")

    resultCountElement.textContent = "Found 0 results"
    notFoundElement.textContent = "Movie not found..."
    notFoundContainer.appendChild(notFoundElement)
    movieDbElement.appendChild(notFoundContainer)
    // movieDbElement.classList.add("movie-not-found")
  }
}

showMovies(movies)

function filteredMovieDB(str: string): typeof movies | undefined {
  const moviesFilteredByTitle: typeof movies = movies.filter(
    (movie: [string, string, string, string, string[], string]) =>
      movie[MOVIE.TITLE].toLowerCase().includes(str.toLowerCase())
  )
  const moviesFilteredByYear: typeof movies = movies.filter(
    (movie: [string, string, string, string, string[], string]) =>
      movie[MOVIE.YEAR].toLowerCase().includes(str.toLowerCase())
  )
  const moviesFilteredByDirector: typeof movies = movies.filter(
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

function sortedMovieDB(sortingCondition: SORT, filteredData?: typeof movies) {
  const sortedData: typeof movies = filteredData ? [...filteredData] : [...movies]
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
    case SORT.BY_RATING_UP:
      return sortedData.sort(
        (
          movieA: [string, string, string, string, string[], string],
          movieB: [string, string, string, string, string[], string]
        ) => Number(movieA[MOVIE.RATING]) - Number(movieB[MOVIE.RATING])
      )
      break
    case SORT.BY_RATING_DOWN:
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
  sortByRatingButton.textContent = "Rating"
  sortByYearButton.textContent = "Year"
})

// searchButton.addEventListener("click", () => {
//   resetMovieDB()
//   showMovies(filteredMovieDB(searchInputElement.value))
// })

let descendingOrder: boolean = false
let activeButton: HTMLButtonElement | null = null
// ↑↓
sortByYearButton.addEventListener("click", () => {
  if (activeButton !== sortByYearButton) {
    descendingOrder = false
    activeButton = sortByYearButton
    sortByRatingButton.textContent = "Rating"
  }

  resetMovieDB()
  if (descendingOrder) {
    searchInputElement.value
      ? showMovies(sortedMovieDB(SORT.BY_YEAR_DOWN, filteredMovieDB(searchInputElement.value)))
      : showMovies(sortedMovieDB(SORT.BY_YEAR_DOWN))
    sortByYearButton.textContent = "Year ↓"
  } else {
    searchInputElement.value
      ? showMovies(sortedMovieDB(SORT.BY_YEAR_UP, filteredMovieDB(searchInputElement.value)))
      : showMovies(sortedMovieDB(SORT.BY_YEAR_UP))
    sortByYearButton.textContent = "Year ↑"
  }

  descendingOrder = !descendingOrder
})

// yearDownButton.addEventListener("click", () => {
//   resetMovieDB()
//   searchInputElement.value
//     ? showMovies(sortedMovieDB(SORT.BY_YEAR_DOWN, filteredMovieDB(searchInputElement.value)))
//     : showMovies(sortedMovieDB(SORT.BY_YEAR_DOWN))
// })

sortByRatingButton.addEventListener("click", () => {
  if (activeButton !== sortByRatingButton) {
    descendingOrder = false
    activeButton = sortByRatingButton
    sortByYearButton.textContent = "Year"
  }
  resetMovieDB()
  if (descendingOrder) {
    searchInputElement.value
      ? showMovies(sortedMovieDB(SORT.BY_RATING_DOWN, filteredMovieDB(searchInputElement.value)))
      : showMovies(sortedMovieDB(SORT.BY_RATING_DOWN))
    sortByRatingButton.textContent = "Rating ↓"
  } else {
    searchInputElement.value
      ? showMovies(sortedMovieDB(SORT.BY_RATING_UP, filteredMovieDB(searchInputElement.value)))
      : showMovies(sortedMovieDB(SORT.BY_RATING_UP))
    sortByRatingButton.textContent = "Rating ↑"
  }
  descendingOrder = !descendingOrder
})

const themeSwitch = document.querySelector(".theme-switch") as HTMLInputElement
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("darkmode")
  document.body.classList.toggle("lightmode")
})
