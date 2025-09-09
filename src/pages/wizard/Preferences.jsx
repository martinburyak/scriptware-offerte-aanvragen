import Grid from '@mui/material/Grid'
import Wizard from '../../layouts/Wizard'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText'
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import Link from '@mui/material/Link';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Preferences({
  locale = 'en',
  sourceLanguage,
  targetLanguage,
  additional,
  setAdditional,
  level,
  setLevel
}) {
  const navigate = useNavigate()

  const [descriptionError, setDescriptionError] = useState(false);

  const onNextButtonClick = () => {
    if (!additional) setDescriptionError(true);

    if (additional) setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/contact' : '/wizard/contact'), 250);
  }

  const onAdditionalChange = event => {
    setDescriptionError(false)
    setAdditional(event.target.value)
  }

  useEffect(() => {
    if (!sourceLanguage || targetLanguage.length === 0)  navigate(locale === 'nl' ? '/nl/wizard/talen' : '/wizard/languages')
  })

  const onLevelChange = event => {
    setLevel(event.target.value);    
  }

  const onBackButtonClick = event => {
    setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/talen' : '/wizard/languages'), 250)
  }

  return (
    <Wizard
      locale={locale}
      title={locale === 'nl' ? 'Voorkeuren' : 'Preferences'}
      subtitle={locale === 'nl' ? 'Vul je voorkeuren in' : 'Enter Your Preferences'}
      step={3}
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
        rowSpacing={2}
        columnSpacing={4}
      >
        <Grid
          item
          xs={12}
        >
          <FormControl>
            <FormLabel color="secondary" id="level" sx={{marginBottom: '.5rem'}}>{locale === 'nl' ? 'Vertaalniveau' : 'Translation Level'}</FormLabel>
            <RadioGroup
              aria-labelledby="level"
              defaultValue="plus"
              name="radio-buttons-group"
              onChange={onLevelChange}
            >
              <FormControlLabel value="budget" control={<Radio color="secondary" />} label="Budget" />
              <FormControlLabel value="basic" control={<Radio color="secondary" />} label="Basic" />
              <FormControlLabel value="plus" control={<Radio color="secondary" />} label="Plus" />
              <FormControlLabel value="premium" control={<Radio color="secondary" />} label="Premium" />
            </RadioGroup>

            <FormHelperText sx={{marginLeft: '0'}}>
              {locale === 'nl' &&
                <>Wij bieden vier vertaaloplossingen, elk met vaste prijzen en bijbehorende voordelen. <Link color="secondary" href="https://www.scriptwaretranslations.com/nl/tarieven">Ontdek welke het beste bij jouw project past.</Link></>
              }

              {locale === 'en' &&
                <>We offer four translation solutions—each with fixed pricing and clear benefits. <Link color="secondary" href="https://www.scriptwaretranslations.com/rates">Find out which one fits your project best.</Link></>
              }
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{marginTop: '2.5rem'}}
        >
          <FormControl
            fullWidth
            error={descriptionError}
          >
            <TextField
              multiline
              size="small"
              value={additional}
              error={descriptionError}
              label={locale === 'nl' ? 'Omschrijving' : 'Description'}
              variant="outlined"
              color="secondary"
              fullWidth
              rows={4}
              onChange={onAdditionalChange}
            />

            <FormHelperText sx={{marginLeft: '0'}}>
              {locale === 'nl' ? 'Geef ons een beschrijving van je vertaalbehoeften. Bijvoorbeeld, om wat voor soort bestanden het gaat en of een beëdigde vertaling noodzakelijk is.' : 'Please provide us a description of your translation needs. E.g. what kind of files are involved and whether a certified translation is necessary.'} 
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Wizard>
  );
}