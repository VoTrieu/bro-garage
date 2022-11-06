import { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import './App.css';

import RootLayout from './components/layout/root-layout/RootLayout';
import HomePage from '../src/pages/home/Home';
import CustomerDetailPage from '../src/pages/customers/CustomerDetailPage';

function App() {
  const toastContent = useSelector(state => state.ui.toastContent);
  const toast = useRef();
  
  useEffect(()=>{
    if(toastContent?.severity){
      toast.current.show(toastContent);
    }
  },[toastContent]);

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
      <Toast ref={toast} position="top-right" />
    </BrowserRouter>
  );
}

export default App;
