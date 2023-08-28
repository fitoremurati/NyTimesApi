class BookSearchApp {
  constructor() {
    this.searchBtn = document.querySelector("#search-btn");
    this.searchByNameBtn = document.querySelector("#search-by-name-btn");
    this.searchBookTitleInput = document.querySelector("#search-book-title-input");
    this.searchBookAuthorInput = document.querySelector("#search-book-author-input");
    this.booksContainer = document.querySelector(".container");

    this.searchBtn.addEventListener("click", this.handleSearchByDate.bind(this));
    this.searchByNameBtn.addEventListener("click", this.handleSearchByName.bind(this));
  }

  async fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.results.books || [];
  }

  async handleSearchByDate() {
    const year = document.querySelector("#book-year").value;
    const month = document.querySelector("#book-month").value;
    const category = document.querySelector("#book-category").value;

    const apiUrl = `https://api.nytimes.com/svc/books/v3/lists/${year}-${month}-28/${category}.json?api-key=4EDUn3KZChwfshWaOVtl29lWIX8zR7Ah`;
    try{
    const data = await this.fetchData(apiUrl);

    this.displayBooks(data, "card");
  }catch (error) {
    console.error("Error fetching data:", error);
    this.booksContainer.innerHTML = `<h2>An error occurred while fetching data.</h2>`;
  }
}
  async handleSearchByName() {
    const title = encodeURIComponent(this.searchBookTitleInput.value);
    const author = encodeURIComponent (this.searchBookAuthorInput.value);

    if(title || author){

    const apiUrl = `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?author=${author}&title=${title}&api-key=4EDUn3KZChwfshWaOVtl29lWIX8zR7Ah`;
    const data = await this.fetchData(apiUrl);

    this.displayBooks(data, "card noimage");
    }
    else{
      this.booksContainer.innerHTML = '<h2>Enter a title or author to search.</h2>';
    }

    this.searchBookTitleInput.value = "";
    this.searchBookAuthorInput.value = "";
  }

  displayBooks(books, cardClassName) {
    this.booksContainer.innerHTML = "";

    if (books.length === 0) {
      this.booksContainer.innerHTML = `<h2>Not Found</h2>`;
    } else {
      books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = cardClassName;
        bookCard.innerHTML = `
        <img src="${book.book_image}" alt="${book.title}" />
          <div>
            <h3>${book.title}</h3>
            by <h4>${book.author}</h4>
            <p>${book.description === null ? " " : book.description}</p>
          </div>
        `;
        if (cardClassName === "card") {
          bookCard.innerHTML += `<a href="${book.buy_links[0].url}" target="_blank"><button>Amazon</button></a>`;
        }
        this.booksContainer.appendChild(bookCard);
      });
    }
  }
}

const app = new BookSearchApp();
