import api from './api';
import { mockStore } from '../data/store';

export const attendanceService = {
  getAttendance: async ({ date = '2026-09-22', classId = 'cls-2' } = {}) => {
    try {
      const response = await api.get('/attendance', { params: { date, classId } });
      return response.data;
    } catch {
      // Find students belonging to this class
      const targetClass = mockStore.classes.find((c) => c.id === classId) || mockStore.classes[1];
      const classStudents = mockStore.students.filter(
        (s) => s.classId === classId || s.className.toLowerCase() === targetClass.name.toLowerCase()
      );

      // Match existing saved attendance or generate default
      const savedRecords = mockStore.attendance.records || [];
      const roster = classStudents.map((student, idx) => {
        const found = savedRecords.find((r) => r.studentId === student.id || r.rollNo === student.rollNo);
        return {
          studentId: student.id,
          rollNo: student.rollNo || String(idx + 1).padStart(2, '0'),
          studentName: student.fullName,
          parentName: student.parentName,
          parentRelation: student.parentRelation,
          studentCode: student.studentId,
          last5Days: student.recentAttendance || ['P', 'P', 'P', 'P', 'P'],
          status: found ? found.status : idx === 2 || idx === 6 ? 'absent' : 'present',
          note: found ? found.note : idx === 2 ? 'Informed - Mild flu' : idx === 6 ? 'Family travel' : '',
        };
      });

      const presentCount = roster.filter((r) => r.status === 'present').length;
      const absentCount = roster.filter((r) => r.status === 'absent').length;

      return {
        date,
        classId,
        className: targetClass.name,
        section: targetClass.section,
        totalEnrolled: roster.length,
        capacity: targetClass.capacity || 25,
        presentCount,
        absentCount,
        presentPercent: roster.length ? ((presentCount / roster.length) * 100).toFixed(1) : 0,
        absentPercent: roster.length ? ((absentCount / roster.length) * 100).toFixed(1) : 0,
        roster,
      };
    }
  },

  markAttendance: async (payload) => {
    try {
      const response = await api.post('/attendance', payload);
      return response.data;
    } catch {
      // Save to mockStore
      mockStore.attendance = {
        date: payload.date || '2026-09-22',
        classId: payload.classId || 'cls-2',
        records: payload.records || [],
      };
      mockStore.saveAttendance();
      return { success: true, message: 'Attendance saved successfully', count: payload.records?.length || 0 };
    }
  },

  getAttendanceHistory: async ({ date, classId, studentName } = {}) => {
    try {
      const response = await api.get('/attendance/history', { params: { date, classId, studentName } });
      return response.data;
    } catch {
      // Build realistic history entries from students and recent records
      const dates = ['2026-09-22', '2026-09-21', '2026-09-20', '2026-09-19', '2026-09-18'];
      let historyLogs = [];

      dates.forEach((d, dIdx) => {
        mockStore.students.slice(0, 10).forEach((student, sIdx) => {
          const isAbsent = (dIdx + sIdx) % 7 === 0;
          historyLogs.push({
            id: `att-${d}-${student.id}`,
            date: d,
            studentId: student.studentId,
            studentName: student.fullName,
            className: student.classSection,
            status: isAbsent ? 'Absent' : 'Present',
            note: isAbsent ? 'Medical leave' : 'On-time',
          });
        });
      });

      if (date) {
        historyLogs = historyLogs.filter((h) => h.date === date);
      }
      if (classId && classId !== 'All') {
        historyLogs = historyLogs.filter((h) => h.className.toLowerCase().includes(classId.toLowerCase()));
      }
      if (studentName) {
        historyLogs = historyLogs.filter((h) =>
          h.studentName.toLowerCase().includes(studentName.toLowerCase()) ||
          h.studentId.toLowerCase().includes(studentName.toLowerCase())
        );
      }

      return historyLogs;
    }
  },
};
