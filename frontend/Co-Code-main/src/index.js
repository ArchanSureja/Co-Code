import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './store/auth.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatProvider from './context/chatContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider >
    {/* <ChatProvider > */}
      <React.StrictMode>
        <App />
        {/* Add toast notifications here */}
        <ToastContainer
          pposition="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          // transition:Bounce
          bodyClassName="toastBody"
        />
      </React.StrictMode>
    {/* </ChatProvider> */}
  </AuthProvider>
);

