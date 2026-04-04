import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminBooksPage } from './pages/AdminBooksPage';
import { BookListPage } from './pages/BookListPage';
import { CartPage } from './pages/CartPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<BookListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminbooks" element={<AdminBooksPage />} />
      </Route>
    </Routes>
  );
}

export default App;
