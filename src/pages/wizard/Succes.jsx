import { useEffect } from 'react'

export default function Succes({ request, locale }) {
  useEffect(() => {
    console.log(request);
    console.log(locale);
  }, [])
  
  return (
    <div>success page</div>
  )
}
