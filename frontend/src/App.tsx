import { useEffect, useMemo, useState } from 'react';
import './App.css';

type Book = {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  numberOfPages: number;
  price: number;
};

type BooksApiResponse = {
  books: Book[];
  totalNumBooks: number;
};

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalNumBooks, setTotalNumBooks] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalNumBooks / pageSize)),
    [totalNumBooks, pageSize]
  );

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5140/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`
        );

        if (!response.ok) {
          throw new Error('Could not load books from the API.');
        }

        const data = (await response.json()) as BooksApiResponse;
        setBooks(data.books);
        setTotalNumBooks(data.totalNumBooks);
      } catch {
        setError(
          'Unable to load books right now. Make sure the backend API is running.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [pageNum, pageSize, sortOrder]);

  function handlePageSizeChange(newPageSize: number) {
    setPageSize(newPageSize);
    setPageNum(1);
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3">Online Bookstore</h1>
      <p className="text-muted mb-4">
        Browse books from the database with sorting and pagination.
      </p>

      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="page-size" className="form-label mb-0">
              Results per page:
            </label>
            <select
              id="page-size"
              className="form-select page-size-select"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-outline-primary"
            onClick={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
          >
            Sort Title: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>
      </div>

      {loading && <p>Loading books...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Pages</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.isbn}</td>
                    <td>{book.category}</td>
                    <td>{book.numberOfPages}</td>
                    <td>${book.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
            <p className="mb-0">
              Showing page {pageNum} of {totalPages} ({totalNumBooks} total
              books)
            </p>
            <div className="btn-group">
              <button
                className="btn btn-secondary"
                onClick={() => setPageNum((prev) => prev - 1)}
                disabled={pageNum === 1}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setPageNum((prev) => prev + 1)}
                disabled={pageNum >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
