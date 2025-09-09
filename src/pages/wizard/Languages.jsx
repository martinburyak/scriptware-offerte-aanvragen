import Wizard from '../../layouts/Wizard'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import importedLanguages from '../../data/languages.json'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useNavigate } from 'react-router-dom'

export default function Languages({locale = 'en', sourceLanguage, setSourceLanguage, targetLanguage, setTargetLanguage}) {
  useEffect(() => {
    dataLayer.push({'event': 'offerte_formulier_stap_2'});
  }, []);
  
  const languages = importedLanguages.map(language => language[locale]).sort();

  const navigate = useNavigate()
  
  const [sourceLanguageError, setSourceLanguageError] = useState(false)

  const [targetLanguages, setTargetLanguages] = useState(languages)
  const [targetLanguageError, setTargetLanguageError] = useState(false)
  const [targetLanguageOpen, setTargetLanguageOpen] = useState(false)

  const onSourceLanguageChange = async (event, value) => {
    setSourceLanguage(event.target.value)

    if (event.target.value) setSourceLanguageError(false)

    setTargetLanguage([])

    setTargetLanguages(languages.filter(language => language !== event.target.value))
  }

  const onPointerDown = (event) => {
    setTargetLanguageOpen(true);
  }

  const onTargetLanguageChange = (event, value) => {
    setTargetLanguageOpen(false);
    setTargetLanguage(event.target.value)

    if (event.target.value.length > 0) setTargetLanguageError(false)
  }

  const onBackButtonClick = () => {
    setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/type' : '/wizard/type'), 250)
  }

  const onNextButtonClick = () => {
    if (!sourceLanguage) setSourceLanguageError(true)
    if (targetLanguage.length === 0) setTargetLanguageError(true)

    if (sourceLanguage && targetLanguage.length > 0) {
      setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/voorkeuren' : '/wizard/preferences'), 250)
    }
  }

  return (
    <Wizard
      locale={locale}
      title={locale === 'nl' ? 'Talen' : 'Languages'}
      subtitle={locale === 'nl' ? 'Kies de talen' : 'Choose Your Languages'}
      step={2}
      steps={5}
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
    >
      <Grid
        container
        direction="column"
        rowSpacing={2}
      >
        <Grid item>
          <FormControl
            error={sourceLanguageError}
            fullWidth
            color="secondary"
            size="small"
          >
            <InputLabel id="source-language">{locale === 'nl' ? 'Vertalen van' : 'Translate From'}</InputLabel>
            
            <Select
              labelId="source-language"
              value={sourceLanguage}
              label={locale === 'nl' ? 'Vertalen van' : 'Translate From'}
              onChange={onSourceLanguageChange}
            >
              {languages.map(language => <MenuItem key={language} value={language}>{language}</MenuItem>)}
            </Select>

            <FormHelperText>{ sourceLanguageError ? (locale === 'nl' ? 'Selecteer een taal' : 'Select a language') : '' }</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl
            error={targetLanguageError}
            fullWidth
            color="secondary"
            size="small"
          >
            <InputLabel id="target-language">{locale === 'nl' ? 'Vertalen naar' : 'Translate To'}</InputLabel>
            
            <Select
              multiple
              labelId="target-language"
              value={targetLanguage}
              input={<OutlinedInput label={locale === 'nl' ? 'Vertalen naar' : 'Translate To'} />}
              onChange={onTargetLanguageChange}
              onPointerDown={onPointerDown}
              open={targetLanguageOpen}
              renderValue={(selected) => selected.join(', ')}
              
            >
              {targetLanguages.map(language => (
                <MenuItem key={language} value={language}>
                  <Checkbox color="secondary" checked={targetLanguage.indexOf(language) > -1} />
                  <ListItemText primary={language} />
                </MenuItem>
              ))}
            </Select>

            <FormHelperText>{ targetLanguageError ? (locale === 'nl' ? 'Selecteer een taal' : 'Select a language') : (locale === 'nl' ? 'Meerdere talen mogelijk' : 'Multiple languages possible') }</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Wizard>
  )
}
