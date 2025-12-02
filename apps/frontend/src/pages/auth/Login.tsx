import { useForm } from 'react-hook-form'
import AuthLayout from '@/components/auth/auth-layout'
import { useAuth } from '@/contexts/auth/use-auth'
import { Link } from 'react-router-dom'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const { login, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password)
  }

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta para continuar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register('email', { required: 'Informe seu email' })}
            placeholder="voce@exemplo.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Senha</label>
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register('password', { required: 'Informe sua senha' })}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition disabled:opacity-60"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="text-center text-sm text-slate-400">
          Não tem conta?{' '}
          <Link to="/auth/register" className="text-emerald-400 hover:underline">
            Cadastre-se
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
