import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BookListPage } from './pages/BookListPage';
import { CartPage } from './pages/CartPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<BookListPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
}

export default App;
