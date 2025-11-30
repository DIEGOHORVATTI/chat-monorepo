import { Text, Section, Container } from '@react-email/components'

import { EmailStyles } from '../constants/styles'

export default function Code({ code }: { code: string }) {
  const { colors, typography, radius, spacing } = EmailStyles

  return (
    <Section style={{ padding: `${spacing.xl} 0` }}>
      <Container
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: radius.md,
          textAlign: 'center',
          padding: `${spacing.lg} 0`,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize['5xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            textAlign: 'center',
          }}
        >
          {code}
        </Text>
      </Container>
    </Section>
  )
}
