export class CommonEnums {
  static ACTIVE = 'active'
  static PENDING = 'pending'
  static DISABLED = 'disabled'
  static DRAFT = 'draft'
  static BINNED = 'binned'

  static status = {
    DRAFT: 'draft',
    BINNED: 'binned',
    DISABLED: 'disabled',
    ACTIVE: 'active',
    DEACTIVE: 'deactive',
  }

  static users = {
    ADMIN: 'admin',
    exhibitor: 'exhibitor',
    delegate: 'delegate',
    sponsor: 'sponsor',
    speaker: 'speaker',
    media_partner: 'media_partners',
  }

  static auth = {
    LOGIN: 'login',
    LOGOUT: 'logout',
  }

  static emailTypes = {
    admin_reset_password: 'admin_reset_password',
  }

  static dbOperationTypes = {
    delete: 'delete',
    update: 'update',
    create: 'create',
  }
}
