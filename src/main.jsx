import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import nhost from './lib/nhost.js';
import { NhostReactProvider } from '@nhost/react'
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/apollo.js';
import { ThemeProvider } from './components/theme-provider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NhostReactProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
           <App />
        </ThemeProvider>
      </ApolloProvider>
    </NhostReactProvider>
  </StrictMode>,
)
//NhostReactProvider provides the nhost object , auth and graphql features without importing client everywhere 

