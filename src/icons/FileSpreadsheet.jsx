import SvgIcon from '@mui/material/SvgIcon';

export default function FileSpreadsheet({color}) {
  return (
    <SvgIcon color={color}>
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        xmlSpace="preserve"
      >
        <path opacity=".4" d="M3.75 3.75A2.75 2.75 0 0 1 6.5 1h6.88v5.5c0 .76.6 1.38 1.37 1.38h5.5v12.37A2.75 2.75 0 0 1 17.5 23h-11a2.75 2.75 0 0 1-2.75-2.75V3.75zm3.78 6.88c-.76 0-1.37.6-1.37 1.37v6.88c0 .76.61 1.37 1.37 1.37h8.94c.76 0 1.37-.61 1.37-1.38V12c0-.76-.61-1.38-1.37-1.38H7.53z"/>
        <path d="M20.25 7.88 13.37 1v5.5c0 .76.62 1.38 1.38 1.38h5.5zM7.53 10.63c-.76 0-1.37.6-1.37 1.37v6.88c0 .76.61 1.37 1.37 1.37h8.94c.76 0 1.37-.61 1.37-1.38V12c0-.76-.61-1.38-1.37-1.38H7.53zm0 4.8v-2.05H9.6v2.06H7.53zm3.44 0v-2.05h2.06v2.06h-2.06zm3.44 0v-2.05h2.06v2.06H14.4zm0 1.38h2.06v2.07H14.4V16.8zm-1.38 0v2.07h-2.06V16.8h2.06zm-3.44 0v2.07H7.53V16.8H9.6z"/>
      </svg>
    </SvgIcon>
  )
}