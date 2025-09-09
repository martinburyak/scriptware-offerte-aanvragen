import { useEffect } from 'react';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stepper from '../components/Stepper'
import Title from '../components/Title'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import FaceZipper from '../icons/FaceZipper';
import LockKeyhole from '../icons/LockKeyhole';

export default function Wizard({
  locale,
  children,
  title,
  subtitle,
  backButton,
  nextButton,
  step = 0,
  steps = 0,
}) {
  const securities = [{
    icon: <LockKeyhole color="primary" />,
    text: locale === 'en' ? 'Sending your data is done via a secure SSL connection.' : 'Het versturen van je gegevens gebeurt via een beveiligde SSL-verbinding.'
  }, {
    icon: <FaceZipper color="primary" />,
    text: locale === 'en' ? 'All our translations are subject to a confidentiality agreement.' : 'Op al onze vertalingen rust een geheimhoudingsverklaring.'
  }]


  const usps = [
    locale === 'nl' ? '100% vrijblijvend' : '100% Without Obligation',
    locale === 'nl' ? '25 jaar ervaring' : '25 Years of Experience',
    locale === 'nl' ? 'Gecertificeerd en kwaliteitsgarantie' : 'Certified and Quality Guaranteed',
  ]

  useEffect(() => {
    document.tidioChatLang = locale;
  }, []);

  return (
    <Grid
      container
      sx={{
        alignItems: {
          md: 'stretch'
        }, 
        height: {
          md: '100%'
        }
      }}
      direction={{
        xs: 'column',
        md: 'row'
      }}
    >
      <Grid
        item
        xs={12}
        md={4}
        lg={3}
      >
        <Stepper
          locale={locale}
          sx={{ p: 4 }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={8}
        lg={6}
      >
        <Box
          sx={{
            boxSizing: 'border-box',
            maxWidth: {
              xs: '574px',
              md: 'initial',
              lg: '640px'
            },
            paddingX: {
              xs: 3,
              md: 4
            },
            paddingY: {
              xs: 0,
              md: 4
            },
            marginX: 'auto'
          }}
        >
          <Title
            size="lg"
            title={title}
            subtitle={subtitle}
            sx={{
              marginBottom: {
                xs: 4,
                md: 8
              }
            }}
          />
          { children }

          <Grid
            container
            sx={{
              alignItems: 'center',
              position: {
                xs: 'fixed',
                md: 'initial'
              },
              left: {
                xs: 0,
                md: 'initial'
              },
              bottom: {
                xs: 0,
                md: 'initial'
              },
              px: {
                xs: 3,
                md: 'initial'
              },
              pb: {
                xs: 3,
                md: 'initial'
              },
              pt: {
                md: 6
              }
            }}
          >
            <Grid
              xs={4}
              item
              sx={{
                textAlign: 'left'
              }}
            >
              {backButton && backButton}
            </Grid>
            
            <Grid
              xs={4}
              item
              sx={{
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1">
                {locale === 'nl' ? `Stap ${step} van ${steps}` : `Step ${step} of ${steps}`}
              </Typography>
            </Grid>
            
            <Grid
              xs={4}
              item
              sx={{
                textAlign: 'right'
              }}
            >
              {nextButton && nextButton}
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid
        item
        lg={3}
        sx={{
          paddingTop: '2rem',
          paddingRight: '2rem',
          paddingBottom: '2rem',
          paddingLeft: '2rem',
          position: 'relative',
          overflow: 'hidden',
          display: {
            xs: 'none',
            lg: 'block'
          },
          backgroundColor: 'blueGrey.800'
        }}
      >
        <Logo style={{width: '15rem'}} />

        <Grid container spacing={1} sx={{marginTop: '3rem'}}>
          {usps.map((usp, index) =>
            <Grid item xs={12} key={index}>
              <Grid container spacing={2} wrap="nowrap">
                <Grid item>
                  <CheckIcon color="primary" fontSize="small" sx={{marginTop: '.25rem'}} />
                </Grid>

                <Grid item>
                  <Typography color="white">
                    {usp}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={1} sx={{marginTop: '4rem'}}>
          {securities.map(({icon, text}, index) => 
            <Grid item xs={12} key={index}>
              <Grid container spacing={2} wrap="nowrap">
                <Grid item>
                  <Box sx={{marginTop: '0.125rem'}}>
                    {icon}
                  </Box>
                </Grid>

                <Grid item>
                  <Typography color="white">
                    {text}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}          
        </Grid>

        
      </Grid>
    </Grid>
  )
}
