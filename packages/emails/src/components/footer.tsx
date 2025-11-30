import { Hr, Text } from '@react-email/components'

import { EmailStyles } from '../constants/styles'

export default function Footer() {
  const yearNow = new Date().getFullYear()
  const { colors, typography } = EmailStyles

  return (
    <>
      <Hr style={{ margin: '10px 0', borderColor: colors.border }} />

      <Text
        style={{ fontSize: typography.fontSize.xs, color: colors.text.light, textAlign: 'center' }}
      >
        © {yearNow} Horvatti Champ. Todos os direitos reservados.
      </Text>
    </>
  )
}
