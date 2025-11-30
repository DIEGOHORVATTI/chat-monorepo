import { Hr, Text, Link, Section, Heading } from '@react-email/components'

import Main from '../components/main'
import { EmailStyles } from '../constants/styles'
import { NotificationsUrl } from '../constants/config'

type Props = {
  name: string
  activityType: string
  activityTitle: string
  activityUrl: string
  activityDescription: string
  unreadCount: number
}

export default function ActivityNotificationEmail({
  name,
  activityType,
  activityTitle,
  activityUrl,
  activityDescription,
  unreadCount,
}: Props) {
  const { colors, typography, spacing } = EmailStyles

  return (
    <Main>
      <Heading
        style={{
          color: colors.text.primary,
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing.md,
        }}
      >
        Olá, {name}!
      </Heading>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Você tem uma nova {activityType}:
      </Text>

      <Section
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '8px',
          padding: spacing.xl,
          marginTop: spacing.md,
        }}
      >
        <Heading
          as="h2"
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            margin: 0,
          }}
        >
          {activityTitle}
        </Heading>

        <Text style={{ fontSize: typography.fontSize.md, margin: `${spacing.md} 0` }}>
          {activityDescription}
        </Text>

        <Link
          href={activityUrl}
          style={{
            color: colors.primary,
            fontWeight: typography.fontWeight.medium,
            textDecoration: 'none',
          }}
        >
          Ver detalhes →
        </Link>
      </Section>

      {unreadCount > 1 && (
        <>
          <Hr style={{ margin: `${spacing.xl} 0`, borderColor: colors.border }} />

          <Text
            style={{
              color: colors.text.muted,
              fontSize: typography.fontSize.sm,
              textAlign: 'center',
            }}
          >
            Você tem mais {unreadCount - 1} notificações não lidas.{' '}
            <Link href={NotificationsUrl} style={{ color: colors.primary, textDecoration: 'none' }}>
              Ver todas
            </Link>
          </Text>
        </>
      )}
    </Main>
  )
}

ActivityNotificationEmail.PreviewProps = {
  name: 'Carlos Silva',
  activityType: 'notificação',
  activityTitle: 'Atualização no relatório de manejo',
  activityUrl: 'http://localhost:3000/manejo/relatorios/123',
  activityDescription: 'O relatório de manejo do lote A123 foi atualizado e requer sua revisão.',
  unreadCount: 3,
} satisfies Props
