// React Router Imports
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate
} from 'react-router-dom'

// React Imports
import { useState } from 'react'

// Page Imports
import Home from './pages/Home'
import Type from './pages/wizard/Type'
import Languages from './pages/wizard/Languages'
import Documents from './pages/wizard/Documents'
import Contact from './pages/wizard/Contact'
import Error from './pages/Error'
import WizardError from './pages/wizard/WizardError'
import Preferences from './pages/wizard/Preferences'
import Success from './pages/wizard/Succes'

// Style Imports
import './styles/page.css'

// MUI Imports
import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles'

// Data Imports
import theme from './data/theme.json'

// Font Imports
import '@fontsource/zilla-slab/500.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/500.css'

function App() {
  const [type, setType] = useState('personal')
  const [sourceLanguage, setSourceLanguage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState([])
  const [files, setFiles] = useState([]);
  const [companyName, setCompanyName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [request, setRequest] = useState({})
  const [additional, setAdditional] = useState('')
  const [level, setLevel] = useState('plus')

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Home />} />

        <Route
          path="/nl/wizard"
          element={
            <Navigate
              to="/nl/wizard/type"
              replace={true}
            />
          }
        />

        <Route
          path="wizard"
          element={
            <Navigate
              to="/wizard/type"
              replace={true}
            />
          }
        />

        <Route
          path="/wizard/type"
          element={
            <Type
              locale="en"
              type={type}
              setType={setType}
            />
          }
        />

        <Route
          path="/nl/wizard/type"
          element={
            <Type
              locale="nl"
              type={type}
              setType={setType}
            />
          }
        />

        <Route
          path="/wizard/languages"
          element={
            <Languages
              locale="en"
              sourceLanguage={sourceLanguage}
              setSourceLanguage={setSourceLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
            />
          }
        />

        <Route
          path="/nl/wizard/talen"
          element={
            <Languages
              locale="nl"
              sourceLanguage={sourceLanguage}
              setSourceLanguage={setSourceLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
            />
          }
        />

        <Route
          path="/wizard/preferences"
          element={
            <Preferences
              locale="en"
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              level={level}
              setLevel={setLevel}
              additional={additional}
              setAdditional={setAdditional}
            />
          }
        />

        <Route
          path="/nl/wizard/voorkeuren"
          element={
            <Preferences
              locale="nl"
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              level={level}
              setLevel={setLevel}
              additional={additional}
              setAdditional={setAdditional}
            />
          }
        />

        <Route
          path="/wizard/documents"
          element={
            <Documents
              locale="en"
              type={type}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              companyName={companyName}
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              country={country}
              additional={additional}
              level={level}
              files={files}
              setFiles={setFiles}
            />
          }
        />

        <Route
          path="/nl/wizard/documenten"
          element={
            <Documents
              locale="nl"
              type={type}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              companyName={companyName}
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              country={country}
              additional={additional}
              level={level}
              files={files}
              setFiles={setFiles}
            />
          }
        />

        <Route
          path="/wizard/contact"
          element={
            <Contact
              locale="en"
              type={type}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              companyName={companyName}
              setCompanyName={setCompanyName}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              country={country}
              setCountry={setCountry}
            />
          }
        />

        <Route
          path="/nl/wizard/contact"
          element={
            <Contact
              locale="nl"
              type={type}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              companyName={companyName}
              setCompanyName={setCompanyName}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              country={country}
              setCountry={setCountry}
              additional={additional}
              setAdditional={setAdditional}
            />
          }
        />

        <Route
          path="/wizard/error"
          element={<WizardError />}
        />

        <Route
          path="/nl/wizard/error"
          element={
            <WizardError
              locale="nl"
            />
          }
        />
        
        <Route path="*" element={<Error />} />
      </Route>    
    )
  )

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
