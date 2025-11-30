import { ENV } from '@repo/service-core'
import { Hr, Img, Link, Text, Button, Heading, Section } from '@react-email/components'

import Main from '../components/main'
import { EmailStyles } from '../constants/styles'
import { SupportEmail } from '../constants/config'

type TermsUpdate = {
  title: string
  description: string
  isImportant?: boolean
}

type Props = {
  recipientName: string
  effectiveDate: string
  termsUpdates: TermsUpdate[]
  termsLink: string
}

export default function TermsUpdateEmail({
  recipientName,
  effectiveDate,
  termsUpdates,
  termsLink,
}: Props) {
  const { colors, typography, spacing, radius } = EmailStyles

  return (
    <Main>
      {/* Cabeçalho */}
      <Heading
        style={{
          color: colors.text.primary,
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.bold,
          textAlign: 'center',
          marginBottom: spacing.md,
        }}
      >
        Atualizações dos Nossos Termos de Uso
      </Heading>

      <Img
        src={`${ENV.APP.WEB_URL}/terms-update.png`}
        alt="Atualização de Termos"
        width="250"
        height="200"
        style={{
          display: 'block',
          margin: '0 auto',
        }}
      />

      {/* Saudação Personalizada */}
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.lg,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Olá {recipientName},
      </Text>

      {/* Mensagem Principal */}
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
          marginTop: spacing.md,
        }}
      >
        Gostaríamos de informar que atualizamos nossos Termos de Uso. Estas mudanças entrarão em
        vigor em <strong>{effectiveDate}</strong>.
      </Text>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
          marginTop: spacing.md,
        }}
      >
        Valorizamos a transparência e, por isso, destacamos abaixo as principais alterações:
      </Text>

      {/* Lista de Atualizações */}
      <Section style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
        {termsUpdates.map((update, index) => (
          <Section
            key={index}
            style={{
              backgroundColor: update.isImportant ? '#FFEFEF' : colors.backgroundSecondary,
              borderRadius: radius.md,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderLeft: update.isImportant ? `4px solid ${colors.error}` : 'none',
            }}
          >
            <Text
              style={{
                color: update.isImportant ? colors.error : colors.text.primary,
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing.sm,
              }}
            >
              {update.title}
              {update.isImportant && ' (Importante)'}
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.fontSize.md,
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {update.description}
            </Text>
          </Section>
        ))}
      </Section>

      {/* Instruções */}
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Recomendamos que você leia atentamente os Termos de Uso completos para compreender todas as
        atualizações. Ao continuar utilizando nossos serviços após {effectiveDate}, você estará
        concordando com estes novos termos.
      </Text>

      {/* Botão de Ação */}
      <Button
        href={termsLink}
        style={{
          backgroundColor: colors.primary,
          color: colors.text.white,
          padding: '12px 20px',
          borderRadius: radius.md,
          fontWeight: typography.fontWeight.semibold,
          fontSize: typography.fontSize.md,
          textDecoration: 'none',
          textAlign: 'center',
          display: 'block',
          margin: `${spacing.xl} auto`,
          width: '240px',
        }}
      >
        Ver Termos de Uso Completos
      </Button>

      {/* Observações Finais */}
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Se você tiver dúvidas sobre estas alterações, entre em contato com nossa equipe de suporte
        em{' '}
        <Link
          href={`mailto:${SupportEmail}`}
          style={{
            color: colors.primary,
            textDecoration: 'underline',
          }}
        >
          {SupportEmail}
        </Link>
        .
      </Text>

      <Hr
        style={{
          borderTop: `1px solid ${colors.border}`,
          margin: `${spacing.xl} 0`,
        }}
      />

      <Text
        style={{
          color: colors.text.muted,
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.normal,
          textAlign: 'center',
        }}
      >
        Este email foi enviado a todos os usuários da plataforma Horvatti Champ. A resposta não é
        necessária.
      </Text>
    </Main>
  )
}

TermsUpdateEmail.PreviewProps = {
  recipientName: 'John Doe',
  effectiveDate: '2023-10-01',
  termsUpdates: [
    {
      title: 'Nova Política de Privacidade',
      description:
        'Atualizamos nossa política de privacidade para incluir novas informações sobre o uso de dados.',
      isImportant: true,
    },
    {
      title: 'Mudanças nos Termos de Uso',
      description: 'Fizemos algumas alterações nos nossos Termos de Uso para melhorar a clareza.',
      isImportant: false,
    },
  ],
  termsLink: 'https://example.com/terms',
} satisfies Props
