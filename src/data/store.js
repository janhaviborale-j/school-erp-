import {
  initialClasses,
  initialParents,
  initialStudents,
  initialFeeStructures,
  initialPayments,
  initialAttendance,
  initialSettings,
} from './mockData';

const STORAGE_KEYS = {
  CLASSES: 'schoolerp_data_classes',
  PARENTS: 'schoolerp_data_parents',
  STUDENTS: 'schoolerp_data_students',
  FEES: 'schoolerp_data_fees',
  PAYMENTS: 'schoolerp_data_payments',
  ATTENDANCE: 'schoolerp_data_attendance',
  SETTINGS: 'schoolerp_data_settings',
};

function getStored(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

// In-memory initialized state
export const mockStore = {
  classes: getStored(STORAGE_KEYS.CLASSES, initialClasses),
  parents: getStored(STORAGE_KEYS.PARENTS, initialParents),
  students: getStored(STORAGE_KEYS.STUDENTS, initialStudents),
  fees: getStored(STORAGE_KEYS.FEES, initialFeeStructures),
  payments: getStored(STORAGE_KEYS.PAYMENTS, initialPayments),
  attendance: getStored(STORAGE_KEYS.ATTENDANCE, initialAttendance),
  settings: getStored(STORAGE_KEYS.SETTINGS, initialSettings),

  // Persistence helpers
  saveStudents() {
    setStored(STORAGE_KEYS.STUDENTS, this.students);
  },
  saveParents() {
    setStored(STORAGE_KEYS.PARENTS, this.parents);
  },
  saveClasses() {
    setStored(STORAGE_KEYS.CLASSES, this.classes);
  },
  saveFees() {
    setStored(STORAGE_KEYS.FEES, this.fees);
  },
  savePayments() {
    setStored(STORAGE_KEYS.PAYMENTS, this.payments);
  },
  saveAttendance() {
    setStored(STORAGE_KEYS.ATTENDANCE, this.attendance);
  },
  saveSettings() {
    setStored(STORAGE_KEYS.SETTINGS, this.settings);
  },

  resetDefaults() {
    this.classes = [...initialClasses];
    this.parents = [...initialParents];
    this.students = [...initialStudents];
    this.fees = [...initialFeeStructures];
    this.payments = [...initialPayments];
    this.attendance = { ...initialAttendance };
    this.settings = { ...initialSettings };
    this.saveStudents();
    this.saveParents();
    this.saveClasses();
    this.saveFees();
    this.savePayments();
    this.saveAttendance();
    this.saveSettings();
  },
};
