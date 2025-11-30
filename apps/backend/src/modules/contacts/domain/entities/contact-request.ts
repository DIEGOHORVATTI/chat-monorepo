export enum ContactRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type ContactRequestProps = {
  senderId: string
  receiverId: string
  status: ContactRequestStatus
  message?: string | null
  createdAt: Date
  updatedAt: Date
}

export type ContactRequest = {
  id: string
} & ContactRequestProps

export const createContactRequest = (props: ContactRequestProps, id?: string): ContactRequest => ({
  id: id || crypto.randomUUID(),
  ...props,
})
