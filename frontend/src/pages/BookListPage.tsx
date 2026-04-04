import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Toast } from 'bootstrap';
import { API_BASE_URL } from '../apiConfig';
import { useCart, type ListSnapshot } from '../context/CartContext';

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

export function BookListPage() {
  const location = useLocation();
  const listSnapshotFromNav = (
    location.state as { listSnapshot?: ListSnapshot } | undefined
  )?.listSnapshot;

  const { addToCart, totalItemCount, cartTotal, items } = useCart();
  const toastRef = useRef<HTMLDivElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalNumBooks, setTotalNumBooks] = useState(0);
  const [pageSize, setPageSize] = useState(listSnapshotFromNav?.pageSize ?? 5);
  const [pageNum, setPageNum] = useState(listSnapshotFromNav?.pageNum ?? 1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    listSnapshotFromNav?.sortOrder ?? 'asc'
  );
  const [category, setCategory] = useState(listSnapshotFromNav?.category ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalNumBooks / pageSize)),
    [totalNumBooks, pageSize]
  );

  const listSnapshot = useMemo<ListSnapshot>(
    () => ({
      category,
      pageNum,
      pageSize,
      sortOrder,
    }),
    [category, pageNum, pageSize, sortOrder]
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/books/categories`);
        if (!res.ok) throw new Error('categories');
        const data = (await res.json()) as string[];
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      setError(null);

      try {
        const catParam =
          category.length > 0
            ? `&category=${encodeURIComponent(category)}`
            : '';
        const response = await fetch(
          `${API_BASE_URL}/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${catParam}`
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
  }, [pageNum, pageSize, sortOrder, category]);

  function handlePageSizeChange(newPageSize: number) {
    setPageSize(newPageSize);
    setPageNum(1);
  }

  function handleCategoryChange(next: string) {
    setCategory(next);
    setPageNum(1);
  }

  function handleAddToCart(book: Book) {
    addToCart(
      {
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        price: book.price,
      },
      listSnapshot
    );
    const el = toastRef.current;
    if (el) {
      Toast.getOrCreateInstance(el).show();
    }
  }

  return (
    <div className="container-fluid py-4">
      {/* Bootstrap Toast: brief feedback when adding to cart */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1100 }}
      >
        <div
          ref={toastRef}
          id="addToCartToast"
          className="toast"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Cart</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            />
          </div>
          <div className="toast-body">Added to your cart.</div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <h1 className="mb-3">Browse books</h1>
          <p className="text-muted mb-4">
            Filter by category, sort titles, and add books to your cart.
          </p>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label htmlFor="category-filter" className="form-label">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    className="form-select"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="page-size" className="form-label">
                    Results per page
                  </label>
                  <select
                    id="page-size"
                    className="form-select page-size-select"
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                  >
                    {[5, 10, 15, 20].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() =>
                      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                    }
                  >
                    Sort title: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <p className="d-flex align-items-center gap-2">
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
              Loading books…
            </p>
          )}
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
                      <th aria-label="Add to cart" />
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
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => handleAddToCart(book)}
                          >
                            Add to cart
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row align-items-center mt-3 g-2">
                <div className="col-md-8">
                  <p className="mb-0">
                    Showing page {pageNum} of {totalPages} ({totalNumBooks}{' '}
                    books
                    {category ? ` in “${category}”` : ''})
                  </p>
                </div>
                <div className="col-md-4">
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setPageNum((prev) => prev - 1)}
                      disabled={pageNum === 1}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setPageNum((prev) => prev + 1)}
                      disabled={pageNum >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card border-primary shadow-sm sticky-top">
            <div className="card-header bg-primary text-white">
              Cart summary
            </div>
            <div className="card-body">
              {items.length === 0 ? (
                <p className="text-muted mb-0">No items in your cart yet.</p>
              ) : (
                <>
                  <p className="mb-2">
                    <span className="fw-semibold">{totalItemCount}</span> item
                    {totalItemCount !== 1 ? 's' : ''} in cart
                  </p>
                  <ul className="list-unstyled small mb-3 border rounded p-2 bg-light">
                    {items.map((item) => (
                      <li
                        key={item.bookId}
                        className="d-flex justify-content-between gap-2 py-1"
                      >
                        <span className="text-truncate">{item.title}</span>
                        <span className="text-nowrap">
                          ×{item.quantity} (${item.price.toFixed(2)} ea.)
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="fw-semibold fs-5 mb-3">
                    Total: ${cartTotal.toFixed(2)}
                  </p>
                </>
              )}
              <Link to="/cart" className="btn btn-primary w-100 mb-2">
                View / edit cart
              </Link>
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                data-bs-toggle="offcanvas"
                data-bs-target="#cartOffcanvas"
              >
                Open cart preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
