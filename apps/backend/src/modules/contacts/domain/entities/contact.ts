export type ContactProps = {
  userId: string
  contactId: string
  nickname?: string | null
  favorite: boolean
  createdAt: Date
  updatedAt: Date
}

export type Contact = {
  id: string
} & ContactProps

export const createContact = (props: ContactProps, id?: string): Contact => ({
  id: id || crypto.randomUUID(),
  ...props,
})
