import "./style.css"
import { movies } from "./movies.ts"
import { SORT } from "./enums/Sort.ts"
import { MOVIE } from "./enums/Movie.ts"

// # VARIABLES

// ~ HTML ELEMENTS
const themeSwitch = document.querySelector(".theme-switch") as HTMLInputElement
const searchInputElement = document.querySelector(".search-input") as HTMLInputElement
const searchPanelsElement = document.querySelector(".search-panels") as HTMLDivElement
const filterWrapperElement = document.querySelector(".filter-wrapper") as HTMLDivElement
const searchCancelButtonElement = document.querySelector(".btn-clear") as HTMLButtonElement
const sortByYearButton = document.querySelector("#sort-year-btn") as HTMLButtonElement
const sortByRatingButton = document.querySelector("#sort-rating-btn") as HTMLButtonElement
const resultCountElement = document.querySelector(".result-count p") as HTMLParagraphElement
const movieDbElement = document.querySelector(".movie-db-section") as HTMLDivElement

// ~ SORTING VARIABLES
let activeButton: HTMLButtonElement | null
let descendingOrder: boolean = false

// ~ DB VARIABLES
let allGenres = new Set<string>()
let genres = new Set<string>()

// ~ SYSTEM VARIABLES
const prefersDarkmode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

// # FUNCTIONS

function showMovies(data: typeof movies | undefined): void {
  if (data && data.length > 0) {
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
    movieNotFound()
  }
  getGenresFromMovieDB(data)
  addGenreButtons(allGenres)
}

function getGenresFromMovieDB(data: typeof movies | undefined): void {
  genres.clear()

  let genresArray: string[] = []

  if (data) {
    data.forEach((movie) => {
      movie[MOVIE.GENRES].forEach((genre) => {
        genresArray.push(genre)
      })
    })

    genresArray.sort().forEach((genre) => {
      genres.add(genre)
    })
  }
}

function getAllGenresFromMovieDB(): void {
  allGenres.clear()

  let genresArray: string[] = []

  if (movies) {
    movies.forEach((movie) => {
      movie[MOVIE.GENRES].forEach((genre) => {
        genresArray.push(genre)
      })
    })

    genresArray.sort().forEach((genre) => {
      allGenres.add(genre)
    })
  }
}

function addGenreButtons(data: Set<string>) {
  while (filterWrapperElement.firstChild) {
    filterWrapperElement.removeChild(filterWrapperElement.firstChild)
  }

  if (data.size > 0) {
    data.forEach((genre) => {
      const genreButton: HTMLButtonElement = document.createElement("button")
      genreButton.textContent = genre
      genreButton.classList.add("genre-btn")
      filterWrapperElement.appendChild(genreButton)

      genreButton.addEventListener("click", () => {
        resetSortButtons()
        resetMovieDB()
        searchInputElement.value
          ? showMovies(
              filteredMovieDB(searchInputElement.value)?.filter((movie) => movie[MOVIE.GENRES].includes(genre))
            )
          : showMovies(movies.filter((movie) => movie[MOVIE.GENRES].includes(genre)))

        const genreButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".genre-btn")
        genreButtons.forEach((button) => {
          if (button.textContent === genre) {
            button.classList.add("active-btn")
            button.addEventListener("click", () => {
              resetMovieDB()
              searchInputElement.value ? showMovies(filteredMovieDB(searchInputElement.value)) : showMovies(movies)
            })
          }
        })
      })
    })

    searchPanelsElement.appendChild(filterWrapperElement)
    filterWrapperElement.style.display = "flex"
  } else {
    filterWrapperElement.style.display = "none"
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

function sortedMovieDB(sortingCondition: SORT, filteredData?: typeof movies): typeof movies {
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

function resetSortButtons(): void {
  descendingOrder = false
  activeButton = null
  sortByYearButton.textContent = "Year"
  sortByYearButton.classList.remove("active-btn")
  sortByRatingButton.textContent = "Rating"
  sortByRatingButton.classList.remove("active-btn")
}

function movieNotFound(): void {
  const notFoundContainer: HTMLDivElement = document.createElement("div")
  const notFoundElement: HTMLHeadingElement = document.createElement("h2")

  resultCountElement.textContent = "Found 0 results"
  notFoundElement.textContent = "Movie not found..."
  notFoundContainer.appendChild(notFoundElement)
  movieDbElement.appendChild(notFoundContainer)
}

// # EVENT LISTENER

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("darkmode")
  console.log(themeSwitch.checked)
})

searchInputElement.addEventListener("input", () => {
  resetMovieDB()
  showMovies(filteredMovieDB(searchInputElement.value))
  sortByRatingButton.textContent = "Rating"
  sortByYearButton.textContent = "Year"
})

searchCancelButtonElement?.addEventListener("click", () => {
  // fix: Button does not react sometimes
  searchInputElement.value = ""
  resetMovieDB()
  resetSortButtons()
  showMovies(movies)
})

sortByYearButton.addEventListener("click", () => {
  if (activeButton !== sortByYearButton) {
    resetSortButtons()
    activeButton = sortByYearButton
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

  sortByYearButton.classList.add("active-btn")
  descendingOrder = !descendingOrder
})

sortByRatingButton.addEventListener("click", () => {
  if (activeButton !== sortByRatingButton) {
    resetSortButtons()
    activeButton = sortByRatingButton
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

  sortByRatingButton.classList.add("active-btn")
  descendingOrder = !descendingOrder
})

// # PAGE LOAD

prefersDarkmode ? document.body.classList.toggle("darkmode") : (themeSwitch.checked = true)
getAllGenresFromMovieDB()
showMovies(movies)
