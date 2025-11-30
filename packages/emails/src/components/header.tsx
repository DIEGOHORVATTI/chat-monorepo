import { ENV } from '@repo/service-core'
import { Img, Heading } from '@react-email/components'

import { EmailStyles } from '../constants/styles'

export default function Header() {
  const { colors, radius } = EmailStyles

  return (
    <Heading
      style={{
        fontSize: '24px',
        backgroundColor: colors.text.primary,
        borderRadius: radius.lg,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        fontWeight: 'bold',
        color: colors.text.white,
        justifyContent: 'center',
        marginBottom: '10px',
      }}
    >
      <Img src={`${ENV.APP.WEB_URL}/logo.png`} width="80" height="80" alt="Champ Logo" />

      <p style={{ fontSize: '30px' }}>Horvatti Champ</p>
    </Heading>
  )
}
