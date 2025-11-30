import { ENV } from '@repo/service-core'
import { Text, Link, Button, Section, Heading, Markdown } from '@react-email/components'

import Main from '../components/main'
import { EmailStyles } from '../constants/styles'

type Props = {
  name: string
  emailContact: string
}

export default function WelcomeEmail({ name, emailContact }: Props) {
  const { colors, typography, spacing, radius } = EmailStyles

  const accessButton = (
    <Section style={{ textAlign: 'center', padding: `${spacing['2xl']} 0` }}>
      <Button
        href={ENV.APP.WEB_URL}
        style={{
          backgroundColor: colors.primary,
          color: colors.text.white,
          padding: `${spacing.md} ${spacing['2xl']}`,
          borderRadius: radius.md,
          textDecoration: 'none',
          fontSize: typography.fontSize.md,
          fontWeight: typography.fontWeight.bold,
        }}
      >
        🚀 Acessar a plataforma
      </Button>
    </Section>
  )

  return (
    <Main>
      <Heading style={{ color: colors.text.primary, fontSize: typography.fontSize['3xl'] }}>
        🎉 Bem-vindo à Horvatti Champ!
      </Heading>

      <Markdown>{`
Estamos muito felizes em ter você com a gente.  
Agora você tem acesso exclusivo a diversos recursos internos:

✅ Documentos e manuais da empresa  
✅ Avisos e comunicados oficiais  
✅ Ferramentas para facilitar seu dia a dia

Aproveite para explorar e conhecer tudo que preparamos para você!
`}</Markdown>

      {accessButton}

      <Text
        style={{
          color: colors.text.muted,
          fontSize: typography.fontSize.base,
          lineHeight: typography.lineHeight.normal,
        }}
      >
        Caso tenha qualquer dúvida, nossa equipe está à disposição no e-mail{' '}
        <Link href={`mailto:${emailContact}`} style={{ color: colors.primary }}>
          {emailContact}
        </Link>
        .
      </Text>
    </Main>
  )
}

WelcomeEmail.PreviewProps = {
  name: 'Fulano da Silva',
  emailContact: 'suporte@horvattichamp.com.br',
}
