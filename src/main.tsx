import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx'
import { Provider } from 'react-redux';
import {store,persistor} from '../App/store.ts'
import { SocketProvider } from './utils/SocketContext.tsx';
createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Provider store={store}>
  <GoogleOAuthProvider clientId="690093010048-64jvock1lfgfkup7216jgehn5ofpafo4.apps.googleusercontent.com">
    <PersistGate loading={null} persistor={persistor}>
  <SocketProvider>
    <App />
  </SocketProvider>
    </PersistGate>
  
  </GoogleOAuthProvider>
  </Provider>
  </StrictMode>

)
