document.addEventListener("DOMContentLoaded", function () {
    const bookTitle = document.querySelector("#inputBookTitle");
    const bookAuthor = document.querySelector("#inputBookAuthor");
    const bookYear = document.querySelector("#inputBookYear");
    const bookIsComplete = document.querySelector("#inputBookIsComplete");
    const form = document.querySelector("#inputBook");
    const submitButton = document.querySelector("#bookSubmit");
    const bookShelf = document.querySelectorAll(".book_shelf");
    const inCompleteBooksContainer = document.querySelector("#incompleteBookshelfList");
    const completeBooksContainer = document.querySelector("#completeBookshelfList");
    const search = document.querySelector("#searchBook");
    const searchInput = document.querySelector("#searchBookTitle");
    let books = JSON.parse(localStorage.getItem("books")) || [];

    renderUI();

    function editSubmitButton(e) {
        if (e.target.checked) {
            return (submitButton.innerHTML = "Masukkan Buku ke rak <span>selesai dibaca</span>");
        }

        return (submitButton.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>");
    }

    function renderUI() {
        let completeContainer = ``;
        let inCompleteContainer = ``;

        books.forEach((book) => {
            if (book.isComplete) {
                return (completeContainer += `
                    <article class="book_item">
                        <h3>${book.title}</h3>
                        <p>Penulis: ${book.author}</p>
                        <p>Tahun: ${book.year}</p>
                        <div class="action">
                            <button class="green" id="moveShelf" data-bookid="${book.id}">Belum selesai di Baca</button>
                            <button class="red" id="deleteButton" data-bookid="${book.id}">Hapus buku</button>
                        </div>
                    </article>
                `);
            }

            return (inCompleteContainer += `
                <article class="book_item">
                    <h3>${book.title}</h3>
                    <p>Penulis: ${book.author}</p>
                    <p>Tahun: ${book.year}</p>
                    <div class="action">
                        <button class="green" id="moveShelf" data-bookid="${book.id}">Sudah selesai di Baca</button>
                        <button class="red" id="deleteButton" data-bookid="${book.id}">Hapus buku</button>
                    </div>
                </article>
            `);
        });

        inCompleteBooksContainer.innerHTML = inCompleteContainer;
        completeBooksContainer.innerHTML = completeContainer;
    }

    function addBook(book) {
        books.push(book);

        if (typeof Storage !== undefined) {
            localStorage.setItem("books", JSON.stringify(books));
        }

        renderUI();
    }

    function moveBook(book) {
        const bookId = parseInt(book.target.dataset.bookid);

        books.filter((book) => book.id === bookId).map((book) => (book.isComplete = !book.isComplete));

        if (typeof Storage !== undefined) {
            localStorage.setItem("books", JSON.stringify(books));
        }

        renderUI();
    }

    function deleteBook(book) {
        const bookId = parseInt(book.target.dataset.bookid);

        books = books.filter((book) => book.id !== bookId);
        if (typeof Storage !== undefined) {
            localStorage.setItem("books", JSON.stringify(books));
        }

        renderUI();
    }

    function filterBooks(keyword) {
        books = books.filter((book) => book.title.indexOf(keyword) !== -1);

        renderUI();
        books = JSON.parse(localStorage.getItem("books")) || [];
    }

    bookIsComplete.addEventListener("change", function (e) {
        editSubmitButton(e);
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const book = {
            id: +new Date(),
            title: bookTitle.value,
            author: bookAuthor.value,
            year: bookYear.value,
            isComplete: bookIsComplete.checked,
        };

        bookTitle.value = "";
        bookAuthor.value = "";
        bookYear.value = "";
        bookIsComplete.checked = false;

        addBook(book);
    });

    bookShelf.forEach((shelf) => {
        shelf.addEventListener("click", function (e) {
            if (e.target.getAttribute("id") === "moveShelf") {
                moveBook(e);
            } else if (e.target.getAttribute("id") === "deleteButton") {
                deleteBook(e);
            }
        });
    });

    search.addEventListener("submit", function (e) {
        e.preventDefault();

        const keyword = searchInput.value;
        filterBooks(keyword);
    });
});
