import "./style.css"
import { MOVIE, movies, SORT } from "./movies.ts"

// # VARIABLES

// ~ HTML ELEMENTS
const themeSwitch = document.querySelector(".theme-switch") as HTMLInputElement
const searchInputElement = document.querySelector(".search-input") as HTMLInputElement
const searchCancelButtonElement = document.querySelector(".btn-clear") as HTMLButtonElement
const sortByYearButton = document.querySelector("#sort-year-btn") as HTMLButtonElement
const sortByRatingButton = document.querySelector("#sort-rating-btn") as HTMLButtonElement
const resultCountElement = document.querySelector(".result-count p") as HTMLParagraphElement
const movieDbElement = document.querySelector(".movie-db-section") as HTMLDivElement

// ~ SORTING VARIABLES
let activeButton: HTMLButtonElement
let descendingOrder: boolean = false

// # FUNCTIONS

function showMovies(data: typeof movies | undefined): void {
  if (data) {
    resultCountElement.textContent = "Found " + data.length + " results"
    data.forEach((movie) => {
      const movieContainer: HTMLDivElement = document.createElement("div")
      const movieTitleElement: HTMLDivElement = document.createElement("div")
      const movieInformationElement: HTMLDivElement = document.createElement("div")
      const movieYearElement: HTMLDivElement = document.createElement("div")
      const movieDirectorElement: HTMLDivElement = document.createElement("div")
      const movieDurationElement: HTMLDivElement = document.createElement("div")
      const movieGenresElement: HTMLDivElement = document.createElement("div")
      const movieRatingElement: HTMLDivElement = document.createElement("div")

      movieTitleElement.innerHTML = `<h2>${movie[MOVIE.TITLE]}</h2>`
      movieYearElement.innerHTML = `<h3>📅 Year</h3> <p>${movie[MOVIE.YEAR]}</p>`
      movieDirectorElement.innerHTML = `<h3>🎬 Director</h3> <p>${movie[MOVIE.DIRECTOR]}</p>`
      movieDurationElement.innerHTML = `<h3>🕝 Duration</h3> <p>${movie[MOVIE.DURATION]}</p>`
      let genresString: string = ""
      movie[MOVIE.GENRES].forEach((genre) => {
        genresString += genre + ", "
      })
      genresString = genresString.slice(0, genresString.length - 2)
      movieGenresElement.innerHTML = `<h3>📚 Genres</h3> <p>${genresString}</p>`
      movieRatingElement.innerHTML = `<h3>⭐ Rating</h3> <p>${movie[MOVIE.RATING]}</p>`

      movieContainer.appendChild(movieTitleElement)

      movieInformationElement.appendChild(movieYearElement)
      movieInformationElement.appendChild(movieDirectorElement)
      movieInformationElement.appendChild(movieDurationElement)
      movieInformationElement.appendChild(movieGenresElement)
      movieInformationElement.appendChild(movieRatingElement)
      movieContainer.appendChild(movieInformationElement)

      movieDbElement.appendChild(movieContainer)
    })
  } else {
    const notFoundContainer: HTMLDivElement = document.createElement("div")
    const notFoundElement: HTMLHeadingElement = document.createElement("h2")

    resultCountElement.textContent = "Found 0 results"
    notFoundElement.textContent = "Movie not found..."
    notFoundContainer.appendChild(notFoundElement)
    movieDbElement.appendChild(notFoundContainer)
  }
}

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

function sortedMovieDB(sortingCondition: SORT, filteredData?: typeof movies): typeof movies | undefined {
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

function resetMovieDB(): void {
  if (movieDbElement) {
    while (movieDbElement.firstChild) {
      movieDbElement.removeChild(movieDbElement.firstChild)
    }
  }
}

// # EVENT LISTENER

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("darkmode")
})

searchInputElement.addEventListener("input", () => {
  resetMovieDB()
  showMovies(filteredMovieDB(searchInputElement.value))
  sortByRatingButton.textContent = "Rating"
  sortByYearButton.textContent = "Year"
})

searchCancelButtonElement?.addEventListener("click", () => {
  searchInputElement.value = ""
  resetMovieDB()
  showMovies(movies)
})

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

showMovies(movies)
