import { useState } from 'react'

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

interface SignUpCardProps {
  setState: (value: SignInFlow) => void
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pb-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          <Input
            disabled={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            required
          />

          <Button disabled={false} type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            variant="outline"
            size="lg"
            className="relative w-full"
          >
            <FcGoogle className="absolute left-2.5 size-5" />
            Continue with Google
          </Button>
          <Button
            disabled={false}
            variant="outline"
            size="lg"
            className="relative w-full"
          >
            <FaGithub className="absolute left-2.5 size-5" />
            Continue with Github
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{' '}
          <button
            onClick={() => setState('signIn')}
            disabled={false}
            className="cursor-pointer font-medium text-sky-700 hover:underline"
          >
            Sign in
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
