// ─────────────────────────────────────────────────────────
// Application-wide Constants
// ─────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN:       'admin',
  TEACHER:     'teacher',
  ACCOUNTANT:  'accountant',
};

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     100,
};

export const STUDENT_STATUS = {
  ACTIVE:   'Active',
  INACTIVE: 'Inactive',
};

export const FEE_STATUS = {
  ACTIVE:   'Active',
  INACTIVE: 'Inactive',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT:  'absent',
};

export const PAYMENT_MODE = {
  CASH:          'Cash',
  UPI:           'UPI',
  BANK_TRANSFER: 'Bank Transfer',
  CHEQUE:        'Cheque',
};

export const CLASS_STATUS = {
  ACTIVE:   'Active',
  INACTIVE: 'Inactive',
};

export const GENDER = {
  MALE:   'Male',
  FEMALE: 'Female',
  OTHER:  'Other',
};

export const HTTP_STATUS = {
  OK:                    200,
  CREATED:               201,
  NO_CONTENT:            204,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  CONFLICT:              409,
  INTERNAL_SERVER_ERROR: 500,
};

export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN:  'LOGIN',
  LOGOUT: 'LOGOUT',
};

export const AUDIT_MODULES = {
  AUTH:     'Auth',
  STUDENT:  'Student',
  PARENT:   'Parent',
  CLASS:    'Class',
  ATTENDANCE: 'Attendance',
  FEE:      'Fee',
  PAYMENT:  'Payment',
  SETTINGS: 'Settings',
};
