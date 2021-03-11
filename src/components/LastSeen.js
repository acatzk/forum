import Router from 'next/router'
import { useEffect } from 'react'
import { useAuthState } from '~/context/auth'
import { hasuraUserClient } from '~/lib/hasura-user-client'
import { UPDATE_USER_LAST_SEEN_MUTATION } from '~/graphql/mutations'

export default function LastSeen ({ children }) {

  const { isAuthenticated, user, save_last_seen } = useAuthState()

  useEffect(() => {
    if (!isAuthenticated || !save_last_seen) return

    Router.events.on("routeChangeComplete", updateLastSeen)

    return () => Router.events.off("routeChangeComplete", updateLastSeen)

  }, [isAuthenticated, save_last_seen])

  const updateLastSeen = async () => {

    const hasura = hasuraUserClient()

    await hasura.request(UPDATE_USER_LAST_SEEN_MUTATION, {
      id: user.id,
      now: new Date().toISOString()
    })
    
  }

  return children
}