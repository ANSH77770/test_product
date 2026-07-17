const USER_ACCESS_KEY = 'auth-user-access';

export const accessControlService = {
  getAssignments() {
    return JSON.parse(localStorage.getItem(USER_ACCESS_KEY) || '{}');
  },
  saveAssignment(email, assignment) {
    const assignments = this.getAssignments();
    assignments[email.toLowerCase()] = assignment;
    localStorage.setItem(USER_ACCESS_KEY, JSON.stringify(assignments));
    return assignment;
  },
  getAssignment(email) {
    return this.getAssignments()[email.toLowerCase()] || { segments: [], channels: [], brands: [] };
  },
  filterRecords(records, assignment) {
    return records.filter((record) =>
      assignment.segments.includes(record.segment)
      && assignment.channels.includes(record.channel)
      && assignment.brands.includes(record.brand),
    );
  },
};
