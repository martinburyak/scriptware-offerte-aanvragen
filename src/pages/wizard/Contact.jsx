import Wizard from '../../layouts/Wizard'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import countries from '../../data/countries.json'

export default function Contact({
  locale = 'en',
  type,
  sourceLanguage,
  targetLanguage,
  files,
  companyName,
  setCompanyName,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  country,
  setCountry,
  request,
  setRequest
}) {
  const navigate = useNavigate()

  const [companyNameError, setCompanyNameError] = useState(false)
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [countryError, setCountryError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)

  useEffect(() => {
    if (!sourceLanguage || targetLanguage.length === 0)  navigate(locale === 'nl' ? '/nl/wizard/talen' : '/wizard/languages')
  })

  useEffect(() => {
    dataLayer.push({'event': 'offerte_formulier_stap_3'});
  }, []);

  const onBackButtonClick = () => {
    setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/voorkeuren' : '/wizard/preferences'), 250);
  }

  const onCompanyNameChange = (event) => {
    setCompanyNameError(false)
    setCompanyName(event.target.value)
  }

  const onFirstNameChange = (event) => {
    setFirstNameError(false)
    setFirstName(event.target.value)
  }

  const onLastNameChange = (event) => {
    setLastNameError(false)
    setLastName(event.target.value)
  }

  const onEmailChange = (event) => {
    setEmailError(false)
    setEmail(event.target.value)
  }

  const onPhoneChange = event => {
    setPhoneError(false)
    setPhone(event.target.value)
  }

  const onCountryChange = event => {
    setCountryError(false)
    setCountry(event.target.value)
  }

  const onNextButtonClick = () => {
    if (type === 'business' && !companyName) setCompanyNameError(true)
    if (!firstName) setFirstNameError(true)
    if (!lastName) setLastNameError(true)
    if (!email) setEmailError(true)
    if (!country) setCountryError(true)
    if (!phone) setPhoneError(true)

    const valid = type === 'business' ? companyName && firstName && lastName && email && country && phone : firstName && lastName && email && country && phone

    if (valid) {
      setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/documenten' : '/wizard/documents'), 250)
    }
  }

  return (
    <Wizard
      locale={locale}
      title={locale === 'nl' ? 'Contactgegevens' : 'Contact Details'}
      subtitle={locale === 'nl' ? 'Vul je contactgegevens in' : 'Enter Your Contact Details'}
      step="4"
      steps="5"
      nextButton={
        <Button
          onClick={onNextButtonClick}
          color="secondary"
          variant="contained"
          size="large"
        >
          {locale === 'nl' ? 'Volgende' : 'Next'}
        </Button>
      }
      backButton={
        <Button
          onClick={onBackButtonClick}
          color="secondary"
          variant="outlined"
          size="large"
        >
          {locale === 'nl' ? 'Vorige' : 'Back'}
        </Button>
      }
      onNextButtonClick={onNextButtonClick}
      nextButtonValue="Send"
    >
      <Grid
        container
        rowSpacing={2}
        columnSpacing={4}
      >
        { type === 'business' &&
          <Grid
            item
            xs={12}
          >
            <FormControl
              fullWidth
              error={companyNameError}
            >
              <TextField
                size="small"
                value={companyName}
                error={companyNameError}
                label={locale === 'nl' ? 'Bedrijfsnaam' : 'Company Name'}
                variant="outlined"
                color="secondary"
                fullWidth
                onChange={onCompanyNameChange}
              />
              <FormHelperText>{ companyNameError ? (locale === 'nl' ? 'Vul een naam in' : 'Enter a valid name') : '' }</FormHelperText>
            </FormControl>
          </Grid>
        }

        <Grid
          item
          xs={6}
        >
          <FormControl
              fullWidth
              error={firstNameError}
            >
              <TextField
                size="small"
                value={firstName}
                error={firstNameError}
                label={locale === 'nl' ? 'Voornaam' : 'First Name'}
                variant="outlined"
                color="secondary"
                fullWidth
                onChange={onFirstNameChange}
              />
              <FormHelperText>{ firstNameError ? (locale === 'nl' ? 'Vul een naam in' : 'Enter a valid name') : '' }</FormHelperText>
            </FormControl>
        </Grid>

        <Grid
          item
          xs={6}
        >
          <FormControl
              fullWidth
              error={lastNameError}
            >
              <TextField
                size="small"

                value={lastName}
                error={lastNameError}
                label={locale === 'nl' ? 'Achternaam' : 'Last Name'}
                variant="outlined"
                color="secondary"
                fullWidth
                onChange={onLastNameChange}
              />
              <FormHelperText>{ lastNameError ? (locale === 'nl' ? 'Vul een naam in' : 'Enter a valid name') : '' }</FormHelperText>
            </FormControl>
        </Grid>

        <Grid
          item
          xs={6}
        >
          <FormControl
              fullWidth
              error={emailError}
            >
              <TextField
                size="small"
                value={email}
                error={emailError}
                label={locale === 'nl' ? 'E-mail' : 'Email'}
                variant="outlined"
                color="secondary"
                fullWidth
                onChange={onEmailChange}
              />
              <FormHelperText>{ emailError ? (locale === 'nl' ? 'Voer een e-mailadres in' : 'Enter a valid email address') : '' }</FormHelperText>
            </FormControl>
        </Grid>

        <Grid
          item
          xs={6}
        >
          <FormControl
            fullWidth
            error={phoneError}
          >
            <TextField
              size="small"
              value={phone}
              error={phoneError}
              label={locale === 'nl' ? 'Telefoonnummer' : 'Phone'}
              variant="outlined"
              color="secondary"
              fullWidth
              onChange={onPhoneChange}
              inputProps={{ inputMode: 'numeric' }}
            />

            <FormHelperText>{ phoneError ? (locale === 'nl' ? 'Vul een telefoonnummer in' : 'Enter a valid phone number') : '' }</FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
        >
          <FormControl
            error={countryError}
            fullWidth
            color="secondary"
            size="small"
          >
            <InputLabel id="country-label">
              {locale === 'nl' ? 'Land' : 'Country'}
            </InputLabel>

            <Select
              labelId="country-label"
              value={country}
              label={locale === 'nl' ? 'Land' : 'Country'}
              onChange={onCountryChange}
            >
              {countries.map(country => <MenuItem key={country.code} value={country.code}>{country[locale]}</MenuItem>)}
            </Select>
            <FormHelperText>{ countryError ? (locale === 'nl' ? 'Selecteer een land' : 'Select a country') : '' }</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Wizard>
  )
}
