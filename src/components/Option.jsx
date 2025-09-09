import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import CardActionArea from '@mui/material/CardActionArea'
import Radio from '@mui/material/Radio'
import Title from './Title'
import Card from '@mui/material/Card'

import { useState } from 'react'

export default function Option({value, Icon, title, subtitle, onClick}) {
  return (
    <Card>
      <CardActionArea
        onClick={e => onClick(value)}
      >
        <Grid
          container
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'nowrap',
            px: 2,
            py: 3
          }}
        >
          <Grid
            item
          >
            <Grid
              container
              columnSpacing={2}
              wrap="nowrap"
              sx={{
                alignItems: 'center'
              }}
            >
              <Grid
                item
              >
                <Icon
                  fontSize="large"
                  sx={{
                    color: 'blueGrey.500'
                  }}
                />
              </Grid>

              <Grid item>
                <Title
                  size="sm"
                  title={title}
                  subtitle={subtitle}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
          >
            <FormControlLabel
              labelPlacement="start"
              value={value}
              sx={{
                ml: 0
              }}
              control={
                <Radio
                  color="secondary"
                  size="small"
                />
              }
            />
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  )
}
