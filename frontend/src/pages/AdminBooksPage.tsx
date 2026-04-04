import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

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

const emptyForm = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  category: '',
  numberOfPages: 1,
  price: 0,
};

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/books/all`);
      if (!res.ok) throw new Error('Could not load books.');
      const data = (await res.json()) as Book[];
      setBooks(data);
    } catch {
      setError('Unable to load books. Is the API running?');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(book: Book) {
    setEditingId(book.bookId);
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      category: book.category,
      numberOfPages: book.numberOfPages,
      price: book.price,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        title: form.title,
        author: form.author,
        publisher: form.publisher,
        isbn: form.isbn,
        category: form.category,
        numberOfPages: form.numberOfPages,
        price: form.price,
      };

      if (editingId === null) {
        const res = await fetch(`${API_BASE_URL}/api/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Could not add book.');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/books/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Could not update book.');
        }
      }

      startAdd();
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book: Book) {
    if (
      !window.confirm(
        `Delete "${book.title}"? This cannot be undone from the website.`
      )
    ) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${book.bookId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Could not delete book.');
      if (editingId === book.bookId) {
        startAdd();
      }
      await loadBooks();
    } catch {
      setError('Delete failed.');
    }
  }

  return (
    <div className="container py-4">
      <div className="row mb-3">
        <div className="col">
          <h1>Admin — books</h1>
          <p className="text-muted mb-0">
            Add, edit, or remove books in the database.{' '}
            <Link to="/">Back to bookstore</Link>
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header">
              {editingId === null
                ? 'Add a new book'
                : `Edit book #${editingId}`}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    className="form-control"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="author">
                    Author
                  </label>
                  <input
                    id="author"
                    className="form-control"
                    value={form.author}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, author: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="publisher">
                    Publisher
                  </label>
                  <input
                    id="publisher"
                    className="form-control"
                    value={form.publisher}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, publisher: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="isbn">
                    ISBN
                  </label>
                  <input
                    id="isbn"
                    className="form-control"
                    value={form.isbn}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isbn: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="category">
                    Category
                  </label>
                  <input
                    id="category"
                    className="form-control"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="pages">
                      Pages
                    </label>
                    <input
                      id="pages"
                      type="number"
                      min={1}
                      className="form-control"
                      value={form.numberOfPages}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          numberOfPages: Number(e.target.value) || 1,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="price">
                      Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      min={0}
                      step={0.01}
                      className="form-control"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          price: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? 'Saving…'
                      : editingId === null
                        ? 'Add book'
                        : 'Save changes'}
                  </button>
                  {editingId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={startAdd}
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header">All books</div>
            <div className="card-body p-0">
              {loading ? (
                <p className="p-3 mb-0">Loading…</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th className="text-end">Price</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((b) => (
                        <tr key={b.bookId}>
                          <td>{b.title}</td>
                          <td>{b.category}</td>
                          <td className="text-end">
                            ${Number(b.price).toFixed(2)}
                          </td>
                          <td className="text-end text-nowrap">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => startEdit(b)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(b)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
