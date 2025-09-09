import SvgIcon from '@mui/material/SvgIcon';

export default function ShieldCheck(props) {
  return (
    <SvgIcon {...props}>
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        xmlSpace="preserve"
      >
        <path d="m12 1 .5.2 9 3.5.7.3v.9c.2 2.1-.1 5.4-1.5 8.6-1.4 3.2-4 6.4-8.2 8.3l-.5.2-.5-.2c-4.3-1.9-6.8-5-8.2-8.3a19.7 19.7 0 0 1-1.6-8.6v-1l.9-.2 8.9-3.5.5-.2zm4.9 9 .7-.8L16 7.8l-.7.7-4.8 4.8-2-2-.7-.8L6.4 12l.7.7 2.8 2.8.7.7.8-.7 5.5-5.5z"/>
      </svg>
    </SvgIcon>
  )
}