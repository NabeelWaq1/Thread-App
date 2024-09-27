import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { SocketContextProvider } from './Context/socketContext.jsx'
import { RecoilRoot } from 'recoil'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { extendTheme } from '@chakra-ui/theme-utils'
import './index.css'


const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props),
    }
  })
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
}

const colors = {
  gray: {
    dark: "#1e1e1e",
    light: "#616161"
  }
}

const theme = extendTheme({ config, styles, colors });

createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </RecoilRoot>,
)
