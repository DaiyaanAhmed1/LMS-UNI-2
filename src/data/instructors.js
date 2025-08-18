export const instructors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Mechanical Engineering',
    specialization: 'Thermodynamics, Fluid Mechanics',
    courses: [
      { course: 'Thermodynamics', program: 'B.Tech Mechanical Engineering', start: '2025-01-01', end: '2025-05-31' },
      { course: 'Fluid Mechanics', program: 'B.Tech Mechanical Engineering', start: '2025-01-01', end: '2025-05-31' }
    ],
    assignedBatches: ['ME2025A', 'ME2025B'],
    status: 'Active',
    joinDate: '2020-08-15'
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    department: 'Computer Science',
    specialization: 'Data Structures, Algorithms',
    courses: [
      { course: 'Data Structures', program: 'B.Tech Computer Applications', start: '2025-01-01', end: '2025-05-31' },
      { course: 'Algorithms', program: 'B.Tech Computer Applications', start: '2025-01-01', end: '2025-05-31' }
    ],
    assignedBatches: ['CA2025A'],
    status: 'Active',
    joinDate: '2018-03-10'
  },
  {
    id: 3,
    name: 'Dr. Emily Brown',
    email: 'emily.brown@university.edu',
    department: 'Agriculture',
    specialization: 'Soil Science, Crop Management',
    courses: [
      { course: 'Soil Science', program: 'B.Agri', start: '2025-01-01', end: '2025-05-31' }
    ],
    assignedBatches: ['AG2025A'],
    status: 'Active',
    joinDate: '2019-01-20'
  }
];

export const departments = [
  'Mechanical Engineering',
  'Computer Applications',
  'Agriculture',
  'Technology',
  'Mathematics',
  'Business Administration',
  'Law',
  'Arts',
  'Psychology',
  'Medicine'
];

export const allBatches = [
  'ME2025A', 'ME2025B', 'CA2025A', 'AG2025A', 'TECH2025A', 'BA2025A', 'LAW2025A', 'ART2025A', 'PSY2025A', 'MED2025A'
]; 