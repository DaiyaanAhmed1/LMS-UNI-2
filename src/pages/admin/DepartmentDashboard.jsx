import Sidebar from '../../components/Sidebar';
import { UserCircle, Users2, Briefcase, School, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Dummy data for university hierarchy
const university = {
  name: 'MarLn University',
  dean: { name: 'Dr. Alice Smith', title: 'University Dean', avatar: '', color: 'bg-blue-700' },
  colleges: [
    {
      name: 'College of Engineering',
      color: 'bg-green-600',
      dean: { name: 'Dr. Bob Lee', title: 'College Dean', avatar: '', color: 'bg-green-700' },
      departments: [
        {
          name: 'Department of Computer Science',
          hod: { name: 'Dr. Carol Jones', title: 'HoD', avatar: '', color: 'bg-blue-500' },
          instructors: [
            { name: 'Prof. David Kim', title: 'Instructor', avatar: '', color: 'bg-blue-300' },
            { name: 'Prof. Eva Green', title: 'Instructor', avatar: '', color: 'bg-blue-300' },
          ],
        },
        {
          name: 'Department of Electrical Engineering',
          hod: { name: 'Dr. Frank White', title: 'HoD', avatar: '', color: 'bg-yellow-500' },
          instructors: [
            { name: 'Prof. Grace Black', title: 'Instructor', avatar: '', color: 'bg-yellow-300' },
            { name: 'Prof. Henry Brown', title: 'Instructor', avatar: '', color: 'bg-yellow-300' },
          ],
        },
      ],
    },
    {
      name: 'College of Science',
      color: 'bg-purple-600',
      dean: { name: 'Dr. Linda White', title: 'College Dean', avatar: '', color: 'bg-purple-700' },
      departments: [
        {
          name: 'Department of Mathematics',
          hod: { name: 'Dr. Mark Lee', title: 'HoD', avatar: '', color: 'bg-purple-500' },
          instructors: [
            { name: 'Prof. Olivia Stone', title: 'Instructor', avatar: '', color: 'bg-purple-300' },
            { name: 'Prof. Paul Gray', title: 'Instructor', avatar: '', color: 'bg-purple-300' },
          ],
        },
        {
          name: 'Department of Physics',
          hod: { name: 'Dr. Susan Clark', title: 'HoD', avatar: '', color: 'bg-pink-500' },
          instructors: [
            { name: 'Prof. Tom White', title: 'Instructor', avatar: '', color: 'bg-pink-300' },
            { name: 'Prof. Uma Black', title: 'Instructor', avatar: '', color: 'bg-pink-300' },
          ],
        },
      ],
    },
  ],
};

function Card({ icon: Icon, color, name, title, className = '' }) {
  const { t } = useTranslation();
  const translatedTitle =
    title === 'University Dean' ? t('admin.departmentDashboard.roles.universityDean') :
    title === 'College Dean' ? t('admin.departmentDashboard.roles.collegeDean') :
    title === 'HoD' ? t('admin.departmentDashboard.roles.hod') :
    title === 'Instructor' ? t('admin.departmentDashboard.roles.instructor') :
    title;
  return (
    <div className={`flex flex-col items-center p-4 rounded-xl shadow-lg bg-white border ${className}`} style={{ minWidth: 180 }}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${color}`}>
        <Icon size={36} className="text-white" />
      </div>
      <div className="font-bold text-gray-800 text-center">{name}</div>
      <div className="text-sm text-blue-700 text-center">{translatedTitle}</div>
    </div>
  );
}

export default function DepartmentDashboard() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">{t('admin.departmentDashboard.title')}</h1>
        <div className="flex flex-col items-center w-full">
          {/* University Dean */}
          <Card
            icon={Building2}
            color={university.dean.color}
            name={university.name}
            title={university.dean.title}
            className="mb-8 border-blue-200"
          />
          {/* Connect to Colleges */}
          <div className="w-1 h-8 bg-gray-400 mb-2"></div>
          {/* Colleges */}
          <div className="flex flex-row flex-wrap justify-center gap-12 mb-12 w-full">
            {university.colleges.map((college, ci) => (
              <div key={ci} className="flex flex-col items-center">
                <Card
                  icon={School}
                  color={college.color}
                  name={college.name}
                  title={college.dean.title}
                  className="mb-6 border-green-200"
                />
                {/* Connect to Departments */}
                <div className="w-1 h-6 bg-gray-400 mb-2"></div>
                {/* Departments */}
                <div className="flex flex-row flex-wrap justify_center gap-8">
                  {college.departments.map((dept, di) => (
                    <div key={di} className="flex flex-col items-center">
                      <Card
                        icon={Briefcase}
                        color={dept.hod.color}
                        name={dept.name}
                        title={dept.hod.title}
                        className="mb-4 border-purple-200"
                      />
                      {/* Connect to Instructors */}
                      <div className="w-1 h-4 bg-gray-400 mb-1"></div>
                      <div className="flex flex-row flex-wrap justify-center gap-4">
                        {dept.instructors.map((inst, ii) => (
                          <Card
                            key={ii}
                            icon={Users2}
                            color={inst.color}
                            name={inst.name}
                            title={inst.title}
                            className="border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 