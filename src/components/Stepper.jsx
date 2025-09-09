import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Grid, Avatar } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import Title from './Title'

export default function Stepper({ sx, locale }) {
  const location = useLocation()

  const [steps, setSteps] = useState([{
    path: locale === 'nl' ? '/nl/wizard/type' : '/wizard/type',
    title: locale === 'nl' ? 'Type klant' : 'Customer Type',
    subtitle: locale === 'nl' ? 'Selecteer je klanttype' : 'Select Your Customer Type',
    active: false,
    done: false
  }, {
    path: locale === 'nl' ? '/nl/wizard/talen' : '/wizard/languages',
    title: locale === 'nl' ? 'Talen' : 'Languages',
    subtitle: locale === 'nl' ? 'Kies de talen' : 'Choose Your Languages',
    active: false,
    done: false
  }, {
    path: locale === 'nl' ? '/nl/wizard/voorkeuren' : '/wizard/preferences',
    title: locale === 'nl' ? 'Voorkeuren' : 'Preferences',
    subtitle: locale === 'nl' ? 'Vul je voorkeuren in' : 'Enter Your Preferences',
    active: false,
    done: false
  }, {
    path: locale === 'nl' ? '/nl/wizard/contact' : '/wizard/contact',
    title: locale === 'nl' ? 'Contactgegevens' : 'Contact Details',
    subtitle: locale === 'nl' ? 'Vul je contactgegevens in' : 'Enter Your Contact Details',
    active: false,
    done: false
  }, {
    path: locale === 'nl' ? '/nl/wizard/documenten' : '/wizard/documents',
    title: locale === 'nl' ? 'Documenten (optioneel)' : 'Documents (optional)',
    subtitle: locale === 'nl' ? 'Selecteer de bestanden' : 'Select your documents',
    active: false,
    done: false
  }])

  function setActive(path) {
    setSteps(oldSteps => {
      const newSteps = []
      let activeSet = false

      oldSteps.forEach(oldStep => {
        if (path === oldStep.path) activeSet = true

        const newStep = {
          path: oldStep.path,
          title: oldStep.title,
          subtitle: oldStep.subtitle,
          active: path === oldStep.path ? true : false,
          done: activeSet ? false : true
        }

        newSteps.push(newStep)
      })

      return newSteps
    })
  }

  useEffect(() => {
    setActive(location.pathname)
  }, [])

  return (
    <Grid
      direction={{
        xs: 'row',
        md: 'column'
      }}
      container
      columnSpacing={{
        xs: '20px',
        md: '0'
      }}
      rowSpacing={{
        xs: '0',
        md: '2.5rem'
      }}
      sx={{
        ...sx, ...{
          justifyContent: 'center'
        }
      }}
    >
      { steps.map((step, index) => (
        <Grid
          key={index}
          item
          sx={{
            position: 'relative',
            ':not(:first-of-type)::after': {
              position: 'absolute',
              content: '""',
              top: {
                xs: '15px',
                md: '-50%'
              },
              left: {
                xs: '0',
                md: '20px'
              },
              width: {
                xs: '20px',
                md: '1px'
              },
              height: {
                xs: '1px',
                md: '125%'
              },
              backgroundColor: 'blueGrey.200',
              zIndex: '1'
            }
          }}
        >
          <Grid
            container
            columnSpacing={{
              xs: '0',
              md: '20px'
            }}
          >
            <Grid
              item
              sx={{
                zIndex: '2'
              }}
            >
              <Avatar
                sx={{
                  borderRadius: 2,
                  bgcolor: step.active ? 'primary.main' : 'grey.100',
                  color: step.active ? 'common.white' : 'grey.500',
                  fontSize: {
                    xs: '15px',
                    md: '18px'
                  },
                  height: {
                    xs: '30px',
                    md: '40px'
                  },
                  width: {
                    xs: '30px',
                    md: '40px'
                  }
                }}
              >
                { step.done && <CheckIcon fontSize="small" /> }
                { !step.done && index +1 }
              </Avatar>
            </Grid>

            <Grid
              item
              sx={{
                display: {
                  xs: 'none',
                  md: 'block'
                }
              }}
            >
              <Title
                light={ step.done ? true : false }
                title={step.title}
                subtitle={step.subtitle}
              />
            </Grid>
          </Grid>
        </Grid>
      )) }
    </Grid>
  )
}
