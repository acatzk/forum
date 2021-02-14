import Head from 'next/head'
import { useAuthState } from './../context/auth'

export default function Home() {
  const { isAuthenticated } = useAuthState()
  
  return isAuthenticated ? 'Hello User' : 'Hello Guest'
}
