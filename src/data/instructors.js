export const instructors = [
  {
    id: 1,
    name: 'Dr. Alice Verma',
    email: 'alice.verma@uni.com',
    department: 'Mechanical Engineering',
    assignedCourses: [
      { course: 'Thermodynamics', program: 'B.Tech Mechanical Engineering', start: '2024-01-01', end: '2024-05-31' },
      { course: 'Fluid Mechanics', program: 'B.Tech Mechanical Engineering', start: '2024-01-01', end: '2024-05-31' }
    ],
    assignedBatches: ['ME2024A', 'ME2024B'],
    engagement: 85 // percent
  },
  {
    id: 2,
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.kumar@uni.com',
    department: 'Computer Applications',
    assignedCourses: [
      { course: 'Data Structures', program: 'B.Tech Computer Applications', start: '2024-01-01', end: '2024-05-31' },
      { course: 'Algorithms', program: 'B.Tech Computer Applications', start: '2024-01-01', end: '2024-05-31' }
    ],
    assignedBatches: ['CA2024A'],
    engagement: 92
  },
  {
    id: 3,
    name: 'Dr. Sunita Sharma',
    email: 'sunita.sharma@uni.com',
    department: 'Agriculture',
    assignedCourses: [
      { course: 'Soil Science', program: 'B.Agri', start: '2024-01-01', end: '2024-05-31' }
    ],
    assignedBatches: ['AG2024A'],
    engagement: 78
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

export const batches = [
  'ME2024A', 'ME2024B', 'CA2024A', 'AG2024A', 'TECH2024A', 'BA2024A', 'LAW2024A', 'ART2024A', 'PSY2024A', 'MED2024A'
]; 