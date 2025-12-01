import type { GroupPermissionsProps } from '../entities'

export interface GroupPermissionsRepository {
  findByChatId(chatId: string): Promise<GroupPermissionsProps | null>
  save(permissions: GroupPermissionsProps): Promise<GroupPermissionsProps>
  update(permissions: GroupPermissionsProps): Promise<GroupPermissionsProps>
}
