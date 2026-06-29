import { AuthShell } from '@/components/features/auth-shell'
import { LoginForm } from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams
  return (
    <AuthShell videoSide="left">
      <LoginForm callbackUrl={callbackUrl ?? ''} />
    </AuthShell>
  )
}
