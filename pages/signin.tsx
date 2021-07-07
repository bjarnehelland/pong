import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'


const Signin = () => {
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      console.log(session)
      router.push('/')
    }
  }, [session, router])

  return (
    <div>
      <div>
        <div>
   
          <div>
              Sign in.
          </div>
          {loading ? (
            <div>loading...</div>
          ) : null}
        </div>
      </div>
      <div>
        <div >
          <button onClick={() => signIn('github')} >Github</button>
        </div>
      </div>
    </div>
  )
}

export default Signin