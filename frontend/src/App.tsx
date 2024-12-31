import { Routes, Route } from 'react-router';
import ProductList from './pages/ProductList';


const App = () => {
  return (
    <Routes>
      <Route index element={<ProductList />} />
    </Routes>
  );
};

export default App;