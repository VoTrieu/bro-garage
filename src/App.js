import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import RootLayout from './components/layout/root-layout/RootLayout';
import HomePage from '../src/pages/home/Home';
import CustomerDetailPage from '../src/pages/customers/CustomerDetailPage';

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer-detail" element={<CustomerDetailPage />}>
            {/* <Route index element={<BlogPostsPage />} />
            <Route path=":id" element={<PostDetailPage />} /> */}
          </Route>
          {/* <Route path="/blog/new" element={<NewPostPage />} /> */}
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
