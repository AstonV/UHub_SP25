import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "../src/components/ui/provider.jsx"
import {ColorModeProvider} from "@/components/ui/color-mode"
import {defaultSystem} from "@chakra-ui/react";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider theme={defaultSystem}>
            <ColorModeProvider>
                <App/>
            </ColorModeProvider>
        </Provider>
    </StrictMode>
    ,
)
