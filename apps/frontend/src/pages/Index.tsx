import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface IndexProps {
  onLogin: (username: string) => void
}

export const Index = ({ onLogin }: IndexProps) => {
  const [username, setUsername] = useState('')

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username.trim())
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Bem-vindo ao Chat MVP</CardTitle>
          <CardDescription>Entre com seu nome para acessar a sala de chat.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="username"
                placeholder="Seu nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} disabled={!username.trim()}>
              Entrar na Sala
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index
