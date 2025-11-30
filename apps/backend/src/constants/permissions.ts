//import { PermissionType } from '@prisma/client';

const PermissionType = {
  USER_CREATE: 'user.create',
  USER_EDIT: 'user.edit',
  USER_DELETE: 'user.delete',
  USER_LIST: 'user.list',

  CATEGORY_CREATE: 'category.create',
  CATEGORY_EDIT: 'category.edit',
  CATEGORY_DELETE: 'category.delete',
  CATEGORY_LIST: 'category.list',

  POST_CREATE: 'post.create',
  POST_EDIT: 'post.edit',
  POST_DELETE: 'post.delete',
  POST_LIST: 'post.list',

  COMMENT_CREATE: 'comment.create',
  COMMENT_EDIT: 'comment.edit',
  COMMENT_DELETE: 'comment.delete',
  COMMENT_LIST: 'comment.list',

  FILE_UPLOAD: 'file.upload',
  FILE_DELETE: 'file.delete',
  FILE_LIST: 'file.list',

  EVENT_CREATE: 'event.create',
  EVENT_EDIT: 'event.edit',
  EVENT_DELETE: 'event.delete',
  EVENT_LIST: 'event.list',
}

/**
 * Permission constants grouped by resource
 * For easy access in the application
 */

const USER_PERMISSIONS = {
  CREATE: PermissionType.USER_CREATE,
  EDIT: PermissionType.USER_EDIT,
  DELETE: PermissionType.USER_DELETE,
  LIST: PermissionType.USER_LIST,
}

const CATEGORY_PERMISSIONS = {
  CREATE: PermissionType.CATEGORY_CREATE,
  EDIT: PermissionType.CATEGORY_EDIT,
  DELETE: PermissionType.CATEGORY_DELETE,
  LIST: PermissionType.CATEGORY_LIST,
}

const POST_PERMISSIONS = {
  CREATE: PermissionType.POST_CREATE,
  EDIT: PermissionType.POST_EDIT,
  DELETE: PermissionType.POST_DELETE,
  LIST: PermissionType.POST_LIST,
}

const COMMENT_PERMISSIONS = {
  CREATE: PermissionType.COMMENT_CREATE,
  EDIT: PermissionType.COMMENT_EDIT,
  DELETE: PermissionType.COMMENT_DELETE,
  LIST: PermissionType.COMMENT_LIST,
}

const FILE_PERMISSIONS = {
  UPLOAD: PermissionType.FILE_UPLOAD,
  DELETE: PermissionType.FILE_DELETE,
  LIST: PermissionType.FILE_LIST,
}

const EVENT_PERMISSIONS = {
  CREATE: PermissionType.EVENT_CREATE,
  EDIT: PermissionType.EVENT_EDIT,
  DELETE: PermissionType.EVENT_DELETE,
  LIST: PermissionType.EVENT_LIST,
}

export const PERMISSIONS = {
  USER: USER_PERMISSIONS,
  CATEGORY: CATEGORY_PERMISSIONS,
  POST: POST_PERMISSIONS,
  COMMENT: COMMENT_PERMISSIONS,
  FILE: FILE_PERMISSIONS,
  EVENT: EVENT_PERMISSIONS,
}
