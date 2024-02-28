import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter()
  return <p>Registration: {router.query.slug}</p>
}