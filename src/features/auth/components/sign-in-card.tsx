import { useState } from 'react'

import { useAuthActions } from '@convex-dev/auth/react'
import { TriangleAlert } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import type { SignInFlow } from '../types'

interface SignInCardProps {
  setState: (value: SignInFlow) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsPending(true)
    setError('')

    signIn('password', { email, password, flow: 'signIn' })
      .catch(() => setError('Invalid email or password!'))
      .finally(() => setIsPending(false))
  }

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    setIsPending(true)

    signIn(provider).finally(() => setIsPending(false))
  }

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pb-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md p-3 text-sm">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0">
        <form onSubmit={handleSignIn} className="space-y-2.5">
          <Input
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />

          <Button
            disabled={isPending}
            type="submit"
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={isPending}
            variant="outline"
            size="lg"
            className="relative w-full"
            onClick={() => handleOAuthSignIn('google')}
          >
            <FcGoogle className="absolute left-2.5 size-5" />
            Continue with Google
          </Button>
          <Button
            disabled={isPending}
            variant="outline"
            size="lg"
            className="relative w-full"
            onClick={() => handleOAuthSignIn('github')}
          >
            <FaGithub className="absolute left-2.5 size-5" />
            Continue with Github
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => setState('signUp')}
            disabled={isPending}
            className="cursor-pointer font-medium text-sky-700 hover:underline"
          >
            Sign up
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
