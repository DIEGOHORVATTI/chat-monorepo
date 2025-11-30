export type Entity<T> = T & {
  id: string
  createdAt: Date
  updatedAt: Date
}
