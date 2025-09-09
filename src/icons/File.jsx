import SvgIcon from '@mui/material/SvgIcon';

export default function File({color}) {
  return (
    <SvgIcon color={color}>
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        xmlSpace="preserve"
      >
        <path opacity=".4" d="M6.5 1a2.75 2.75 0 0 0-2.75 2.75v16.5A2.75 2.75 0 0 0 6.5 23h11a2.75 2.75 0 0 0 2.75-2.75V7.87h-5.5c-.76 0-1.38-.6-1.38-1.37V1H6.5z"/>
        <path d="m13.38 1 6.87 6.88h-5.5c-.76 0-1.38-.62-1.38-1.38V1z"/>
      </svg>
    </SvgIcon>
  )
}
