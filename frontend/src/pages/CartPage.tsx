import { useNavigate } from 'react-router-dom';
import {
  CONTINUE_SNAPSHOT_KEY,
  type ListSnapshot,
  useCart,
} from '../context/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { items, setLineQuantity, cartTotal, lineSubtotal } = useCart();

  function handleContinueShopping() {
    let listSnapshot: ListSnapshot | undefined;
    const raw = sessionStorage.getItem(CONTINUE_SNAPSHOT_KEY);
    if (raw) {
      try {
        listSnapshot = JSON.parse(raw) as ListSnapshot;
      } catch {
        listSnapshot = undefined;
      }
    }
    navigate('/', { state: { listSnapshot } });
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12 col-lg-10 mx-auto">
          <h1 className="mb-4">Shopping cart</h1>

          {items.length === 0 ? (
            <div className="alert alert-info">
              Your cart is empty.{' '}
              <button
                type="button"
                className="btn btn-link p-0 align-baseline"
                onClick={() => navigate('/')}
              >
                Browse books
              </button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th className="text-end">Price</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.bookId}>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td className="text-end">${item.price.toFixed(2)}</td>
                        <td className="text-center">
                          <div
                            className="btn-group btn-group-sm"
                            role="group"
                            aria-label={`Quantity for ${item.title}`}
                          >
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                setLineQuantity(item.bookId, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span className="btn btn-light disabled">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                setLineQuantity(item.bookId, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-semibold">
                          ${lineSubtotal(item).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-primary">
                      <th colSpan={4} className="text-end">
                        Order total
                      </th>
                      <th className="text-end">${cartTotal.toFixed(2)}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleContinueShopping}
                >
                  Continue shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
