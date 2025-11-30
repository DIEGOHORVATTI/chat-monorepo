import { ENV } from '@repo/service-core'
import { Hr, Text, Link, Button, Section, Heading } from '@react-email/components'

import Main from '../components/main'
import { EmailStyles } from '../constants/styles'

type MetricItem = {
  label: string
  value: string
  change?: string
  isPositive?: boolean
}

type Props = {
  name: string
  reportType: string
  period: string
  metrics: MetricItem[]
  reportUrl: string
}

export default function ReportEmail({ name, reportType, period, metrics, reportUrl }: Props) {
  const { colors, typography, spacing, radius } = EmailStyles

  return (
    <Main>
      <Heading
        style={{
          color: colors.text.primary,
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          marginBottom: spacing.md,
        }}
      >
        Relatório {reportType}
      </Heading>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Olá {name},
      </Text>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Seu relatório {reportType.toLowerCase()} para o período de {period} está pronto. Confira os
        principais indicadores abaixo:
      </Text>

      <Section style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}>
        {metrics.map((metric, index) => (
          <div key={index}>
            <Section
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radius.md,
                padding: spacing.lg,
                marginBottom: spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.muted,
                  margin: 0,
                }}
              >
                {metric.label}
              </Text>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    margin: `${spacing.xs} 0 0 0`,
                  }}
                >
                  {metric.value}
                </Text>
                {metric.change && (
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: metric.isPositive ? colors.success : colors.error,
                      fontWeight: typography.fontWeight.medium,
                      margin: 0,
                    }}
                  >
                    {metric.change}
                  </Text>
                )}
              </div>
            </Section>
          </div>
        ))}
      </Section>

      <Section style={{ textAlign: 'center', margin: `${spacing['2xl']} 0` }}>
        <Button
          href={reportUrl}
          style={{
            backgroundColor: colors.primary,
            color: colors.text.white,
            padding: `${spacing.md} ${spacing.xl}`,
            borderRadius: radius.md,
            textDecoration: 'none',
            fontWeight: typography.fontWeight.medium,
          }}
        >
          Ver Relatório Completo
        </Button>
      </Section>

      <Hr style={{ borderColor: colors.border, margin: `${spacing.xl} 0` }} />

      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.muted,
        }}
      >
        Este relatório é gerado automaticamente. Acesse{' '}
        <Link
          href={`${ENV.APP.WEB_URL}/configuracoes/relatorios`}
          style={{ color: colors.primary }}
        >
          configurações de relatórios
        </Link>{' '}
        para personalizar a frequência e o tipo de informações que você recebe.
      </Text>
    </Main>
  )
}

ReportEmail.PreviewProps = {
  name: 'André Santos',
  reportType: 'Mensal de Produção',
  period: '01/08/2025 a 31/08/2025',
  metrics: [
    {
      label: 'Produção Total',
      value: '5.230 kg',
      change: '+8,2%',
      isPositive: true,
    },
    {
      label: 'Média por Animal',
      value: '17,4 kg/dia',
      change: '+2,3%',
      isPositive: true,
    },
    {
      label: 'Taxa de Conversão Alimentar',
      value: '1,42',
      change: '-0,5%',
      isPositive: false,
    },
    {
      label: 'Custo por kg Produzido',
      value: 'R$ 3,75',
      change: '-2,1%',
      isPositive: true,
    },
  ],
  reportUrl: 'http://localhost:3000/relatorios/producao/08-2025',
} satisfies Props
