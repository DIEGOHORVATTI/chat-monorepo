import { useForm } from 'react-hook-form'
import AuthLayout from '@/components/auth/auth-layout'
import { useAuth } from '@/contexts/auth/use-auth'
import { Link } from 'react-router-dom'

interface RegisterForm {
  name: string
  email: string
  password: string
}

export default function Register() {
  const { register: registerUser, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = async (data: RegisterForm) => {
    await registerUser(data.name, data.email, data.password)
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Preencha os dados para se cadastrar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Nome</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register('name', { required: 'Informe seu nome' })}
            placeholder="Seu nome"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

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
            {...register('password', { required: 'Crie uma senha' })}
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
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <div className="text-center text-sm text-slate-400">
          Já tem conta?{' '}
          <Link to="/auth/login" className="text-emerald-400 hover:underline">
            Entrar
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
