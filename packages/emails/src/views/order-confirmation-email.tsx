import { ENV } from '@repo/service-core'
import { Hr, Row, Text, Link, Column, Section, Heading } from '@react-email/components'

import Main from '../components/main'
import { EmailStyles } from '../constants/styles'
import { SupportEmail } from '../constants/config'

type OrderItem = {
  name: string
  quantity: number
  price: number
}

type Props = {
  name: string
  orderNumber: string
  orderDate: string
  items: OrderItem[]
  total: number
  paymentMethod: string
  trackingLink?: string
}

export default function OrderConfirmationEmail({
  name,
  orderNumber,
  orderDate,
  items,
  total,
  paymentMethod,
  trackingLink,
}: Props) {
  const { colors, typography, spacing, radius } = EmailStyles

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

  return (
    <Main>
      <Heading
        style={{
          color: colors.text.primary,
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          textAlign: 'center',
          margin: `${spacing.lg} 0 ${spacing.xl}`,
        }}
      >
        Confirmação do Pedido
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
        Seu pedido foi recebido e está sendo processado. Abaixo estão os detalhes da sua compra:
      </Text>

      <Section
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: radius.md,
          padding: spacing.xl,
          marginTop: spacing.xl,
        }}
      >
        <Row>
          <Column>
            <Text style={{ margin: 0, fontWeight: typography.fontWeight.medium }}>
              Número do Pedido:
            </Text>
          </Column>
          <Column>
            <Text style={{ margin: 0, textAlign: 'right' }}>{orderNumber}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={{ margin: 0, fontWeight: typography.fontWeight.medium }}>
              Data do Pedido:
            </Text>
          </Column>
          <Column>
            <Text style={{ margin: 0, textAlign: 'right' }}>{orderDate}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={{ margin: 0, fontWeight: typography.fontWeight.medium }}>
              Método de Pagamento:
            </Text>
          </Column>
          <Column>
            <Text style={{ margin: 0, textAlign: 'right' }}>{paymentMethod}</Text>
          </Column>
        </Row>
      </Section>

      <Heading
        as="h2"
        style={{
          fontSize: typography.fontSize.xl,
          marginTop: spacing['2xl'],
          marginBottom: spacing.md,
        }}
      >
        Itens do Pedido
      </Heading>

      <Hr style={{ borderColor: colors.border, margin: `${spacing.md} 0` }} />

      {items.map((item, index) => (
        <Section key={index}>
          <Row>
            <Column>
              <Text
                style={{
                  margin: `${spacing.sm} 0`,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.muted,
                }}
              >
                Quantidade: {item.quantity}
              </Text>
            </Column>
            <Column>
              <Text
                style={{
                  margin: 0,
                  textAlign: 'right',
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </Column>
          </Row>
          {index < items.length - 1 && (
            <Hr
              style={{
                borderColor: colors.border,
                borderStyle: 'dashed',
                margin: `${spacing.md} 0`,
              }}
            />
          )}
        </Section>
      ))}

      <Hr style={{ borderColor: colors.border, margin: `${spacing.md} 0` }} />

      <Section>
        <Row>
          <Column>
            <Text
              style={{
                margin: 0,
                fontWeight: typography.fontWeight.bold,
                fontSize: typography.fontSize.lg,
              }}
            >
              Total
            </Text>
          </Column>
          <Column>
            <Text
              style={{
                margin: 0,
                textAlign: 'right',
                fontWeight: typography.fontWeight.bold,
                fontSize: typography.fontSize.lg,
              }}
            >
              {formatCurrency(total)}
            </Text>
          </Column>
        </Row>
      </Section>

      {trackingLink && (
        <Section style={{ textAlign: 'center', margin: `${spacing['2xl']} 0` }}>
          <Link
            href={trackingLink}
            style={{
              backgroundColor: colors.primary,
              color: colors.text.white,
              padding: `${spacing.md} ${spacing.xl}`,
              borderRadius: radius.md,
              textDecoration: 'none',
              fontWeight: typography.fontWeight.medium,
            }}
          >
            Acompanhar Pedido
          </Link>
        </Section>
      )}

      <Hr style={{ borderColor: colors.border, margin: `${spacing['2xl']} 0 ${spacing.xl}` }} />

      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.muted,
          textAlign: 'center',
        }}
      >
        Para qualquer dúvida sobre seu pedido, entre em contato com nosso suporte em{' '}
        <Link href={`mailto:${SupportEmail}`} style={{ color: colors.primary }}>
          {SupportEmail}
        </Link>{' '}
        ou acesse sua{' '}
        <Link href={`${ENV.APP.WEB_URL}/pedidos`} style={{ color: colors.primary }}>
          área de pedidos
        </Link>
        .
      </Text>
    </Main>
  )
}

OrderConfirmationEmail.PreviewProps = {
  name: 'João Silva',
  orderNumber: '#12345',
  orderDate: '31/08/2025',
  items: [
    {
      name: 'Suplemento Mineral Premium',
      quantity: 2,
      price: 189.9,
    },
    {
      name: 'Kit de Vacinação',
      quantity: 1,
      price: 459.0,
    },
  ],
  total: 838.8,
  paymentMethod: 'Cartão de Crédito',
  trackingLink: 'http://localhost:3000/pedidos/12345/rastreamento',
} satisfies Props
