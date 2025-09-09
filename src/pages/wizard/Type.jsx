import Wizard from '../../layouts/Wizard'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import Typography from '@mui/material/Typography'
import Title from '../../components/Title'
import Button from '@mui/material/Button'
import Option from '../../components/Option'

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Type({type, setType, locale}) {
  const navigate = useNavigate()

  useEffect(() => {
    dataLayer.push({'event': 'offerte_formulier_stap_1'});
  }, []);

  const onOptionClick = (value) => {
    setType(value)
  }

  const onNextButtonClick = () => {
    setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/talen' : '/wizard/languages'), 250)
  }

  return (
    <Wizard
      locale={locale}
      title={locale === 'nl' ? 'Type klant' : 'Customer Type'}
      subtitle={locale === 'nl' ? 'Selecteer je klanttype' : 'Select Your Customer Type'}
      step={1}
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
    >

      <FormControl
        fullWidth
      >
        
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={type}
        >

          <Grid
            container
            rowSpacing={{
              xs: 3,
              md: 0
            }}
            columnSpacing={{
              xs: 0,
              md: 4
            }}
            wrap="nowrap"
            direction={{
              xs: 'column',
              md: 'row'
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <Option
                onClick={onOptionClick}
                value="personal"
                Icon={PersonIcon}
                title={locale === 'nl' ? 'Particulier' : 'Private Individual'}
                subtitle={locale === 'nl' ? 'Doe je aanvraag als individu' : 'Make your request as an individual'}
              />
            </Grid>

            <Grid
              item
              xs={6}
            >
              <Option
                onClick={onOptionClick}
                value="business"
                Icon={BusinessIcon}
                title={locale === 'nl' ? 'Zakelijk' : 'Business'}
                subtitle={locale === 'nl' ? 'Doe je aanvraag als bedrijf' : 'Make your request as a business'}
              />
            </Grid>
          </Grid>

        </RadioGroup>

      </FormControl>
    </Wizard>
  )
}
