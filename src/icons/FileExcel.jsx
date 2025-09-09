import SvgIcon from '@mui/material/SvgIcon';

export default function FileExcel({color}) {
  return (
    <SvgIcon color={color}>
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        xmlSpace="preserve"
      >
        <path opacity=".4" d="M3.75 3.75A2.75 2.75 0 0 1 6.5 1h6.88v5.5c0 .76.6 1.38 1.37 1.38h5.5v12.37A2.75 2.75 0 0 1 17.5 23h-11a2.75 2.75 0 0 1-2.75-2.75V3.75zm6.69 8a1.03 1.03 0 1 0-1.69 1.18l2 2.85-2 2.85a1.03 1.03 0 1 0 1.69 1.18L12 17.58l1.56 2.23a1.03 1.03 0 1 0 1.69-1.18l-2-2.85 2-2.84a1.03 1.03 0 1 0-1.69-1.18L12 13.98l-1.56-2.23z"/>
        <path d="M20.25 7.88 13.37 1v5.5c0 .76.62 1.38 1.38 1.38h5.5zm-9.81 3.87a1.03 1.03 0 1 0-1.69 1.18l2 2.85-2 2.85a1.03 1.03 0 1 0 1.69 1.18L12 17.58l1.56 2.23a1.03 1.03 0 1 0 1.69-1.18l-2-2.85 2-2.84a1.03 1.03 0 1 0-1.69-1.18L12 13.98l-1.56-2.23z"/>
      </svg>
    </SvgIcon>
  )
}
