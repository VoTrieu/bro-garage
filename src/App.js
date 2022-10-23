import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import RootLayout from './components/layout/root-layout/RootLayout';
import HomePage from '../src/pages/home/Home';
import CustomerPage from '../src/pages/customers/Customer';

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer" element={<CustomerPage />}>
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
