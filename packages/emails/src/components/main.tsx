import { Html, Head, Body, Text, Container } from '@react-email/components'

import Header from './header'
import Footer from './footer'
import { EmailStyles } from '../constants/styles'

export default function Main({ children }: React.PropsWithChildren) {
  const { colors, typography, shadows, radius } = EmailStyles

  return (
    <Html>
      <Head />

      <Body
        style={{
          backgroundColor: colors.background,
          fontFamily: typography.fontFamily,
        }}
      >
        <Container
          style={{
            borderRadius: radius.lg,
            boxShadow: shadows.md,
            minHeight: '100vh',
          }}
        >
          <Header />

          <Container style={{ maxWidth: '600px', padding: '20px', margin: '0 auto' }}>
            {children as any}

            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginTop: '16px',
              }}
            >
              Atenciosamente,
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.fontSize.sm,
                lineHeight: typography.lineHeight.normal,
              }}
            >
              — Equipe Horvatti Champ
            </Text>
          </Container>

          <Footer />
        </Container>
      </Body>
    </Html>
  )
}
