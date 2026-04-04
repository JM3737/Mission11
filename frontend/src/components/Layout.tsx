import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Layout() {
  const { items, totalItemCount, cartTotal, lineSubtotal } = useCart();

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Online Bookstore
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-md-center gap-2">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Books
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/adminbooks">
                  Admin books
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  Cart
                  {totalItemCount > 0 && (
                    <span className="badge text-bg-light ms-1">
                      {totalItemCount}
                    </span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm my-1 my-md-0"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#cartOffcanvas"
                  aria-controls="cartOffcanvas"
                >
                  Cart preview
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Bootstrap Offcanvas: slide-out cart preview (not covered in basic class videos) */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">
            Your cart
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body d-flex flex-column">
          {items.length === 0 ? (
            <p className="text-muted mb-0">Your cart is empty.</p>
          ) : (
            <ul className="list-group list-group-flush flex-grow-1">
              {items.map((item) => (
                <li
                  key={item.bookId}
                  className="list-group-item px-0 d-flex justify-content-between gap-2"
                >
                  <span className="small">
                    {item.title}{' '}
                    <span className="text-muted">×{item.quantity}</span>
                  </span>
                  <span className="text-nowrap small">
                    ${lineSubtotal(item).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-top pt-3 mt-auto">
            <p className="mb-2 fw-semibold">Total: ${cartTotal.toFixed(2)}</p>
            <Link
              to="/cart"
              className="btn btn-primary w-100"
              data-bs-dismiss="offcanvas"
            >
              View full cart
            </Link>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
}
