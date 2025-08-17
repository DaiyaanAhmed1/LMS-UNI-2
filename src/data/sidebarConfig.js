export const sidebarItems = {
    student: [
      {
        title: 'Dashboard',
        path: '/student/dashboard',
        icon: '🏠',
      },
      {
        title: 'Assignments',
        path: '/student/assignments',
        icon: '📝',
        subItems: [
          { title: 'Pending', path: '/student/assignments/pending' },
          { title: 'Submitted', path: '/student/assignments/submitted' },
        ],
      },
      {
        title: 'Attendance',
        path: '/student/attendance',
        icon: '📊',
      },
    ],
    instructor: [
      {
        title: 'Dashboard',
        path: '/instructor/dashboard',
        icon: '📋',
      },
      {
        title: 'Classes',
        path: '/instructor/classes',
        icon: '📚',
      },
    ],
    admin: [
      {
        title: 'Admin Panel',
        path: '/admin/dashboard',
        icon: '🛠️',
      },
      {
        title: 'Manage Users',
        path: '/admin/users',
        icon: '👥',
        subItems: [
          { title: 'Instructors', path: '/admin/users/instructors' },
          { title: 'Students', path: '/admin/users/students' },
        ],
      },
      {
        title: 'Data Retention Policy',
        path: '/admin/data-retention',
        icon: '📄',
      },
    ],
  };
  