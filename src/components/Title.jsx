import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function Title({ size='md', title="Title", subtitle, light, sx }) {
  return (
    <Box sx={sx}>
      <Typography
        variant={ size === 'lg' ? 'h1' : size === 'sm' ? 'h3' : 'h2' }
        sx={{ color: light ? 'blueGrey.400' : 'blueGrey.900' }}
      >
        { title }
      </Typography>

      { subtitle && 
        <Typography
          sx={{
            color: light ? 'blueGrey.300' : 'blueGrey.400',
            mt: size === 'lg' ? 0.5 : size === 'sm' ? 0 : 0.25
          }}
          variant={size === 'lg' ? 'subtitle1' : size === 'sm' ? 'subtitle3' : 'subtitle2'}
        >
          { subtitle }
        </Typography>
      }
    </Box>
  )
}