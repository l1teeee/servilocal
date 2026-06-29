import { AuthShell } from '@/components/features/auth-shell'
import { RegisterForm } from './register-form'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams
  return (
    <AuthShell videoSide="right">
      <RegisterForm callbackUrl={callbackUrl ?? ''} />
    </AuthShell>
  )
}
