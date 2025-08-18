import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentsManagement from './pages/admin/StudentsManagement.jsx';
import InstructorDashboard from './pages/instructor/InstructorDashboard.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProgramManagement from './pages/admin/ProgramManagement.jsx';
import InstructorManagement from './pages/admin/InstructorManagement.jsx';
import CourseManagement from './pages/admin/CourseManagement.jsx';
import DocumentManagement from './pages/admin/DocumentManagement.jsx';
import AcademicCalendar from './pages/admin/AcademicCalendar.jsx';
import Notifications from './pages/admin/Notifications.jsx';
import Reports from './pages/admin/Reports.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import SystemSettings from './pages/admin/SystemSettings.jsx';
import Profile from './pages/admin/Profile.jsx';
import DepartmentDashboard from './pages/admin/DepartmentDashboard.jsx';
import InstructorProfile from './pages/instructor/Profile.jsx';
import MyCourses from './pages/instructor/MyCourses.jsx';
import InstructorStudentsManagement from './pages/instructor/StudentsManagement.jsx';
import Assignments from './pages/instructor/Assignments.jsx';
import Grades from './pages/instructor/Grades.jsx';
import TeachingSchedule from './pages/instructor/TeachingSchedule.jsx';
import CourseMaterials from './pages/instructor/CourseMaterials.jsx';
import NotificationsInstructor from './pages/instructor/Notifications.jsx';
import InstructorStudentMessages from './pages/instructor/StudentMessages.jsx';
import StudentProfile from './pages/student/Profile.jsx';
import StudentCourses from './pages/student/Courses.jsx';
import StudentAssignments from './pages/student/Assignments.jsx';
import StudentGrades from './pages/student/Grades.jsx';
import StudentSchedule from './pages/student/Schedule.jsx';
import StudentMaterials from './pages/student/Materials.jsx';
import StudentMessages from './pages/student/Messages.jsx';
import StudentNotifications from './pages/student/Notifications.jsx';
import StudyPlan from './pages/student/StudyPlan.jsx';
import AssignmentSubmission from './pages/student/AssignmentSubmission.jsx';
import DefinitionsSubmissionForm from './pages/student/DefinitionsSubmissionForm.jsx';
import CheckMyVAE from './pages/student/CheckMyVAE.jsx';
import ZoolaReport from './pages/student/ZoolaReport.jsx';
import CaseBriefsSubmissionForm from './pages/student/CaseBriefsSubmissionForm.jsx';
import MidtermEssaySubmissionForm from './pages/student/MidtermEssaySubmissionForm.jsx';
import MiniThesisSubmissionForm from './pages/student/MiniThesisSubmissionForm.jsx';
import CoursePdfViewer from './pages/student/CoursePdfViewer.jsx';
import CourseVideoViewer from './pages/student/CourseVideoViewer.jsx';
import Ecollab from './pages/student/Ecollab.jsx';
import SageAI from './pages/student/SageAI.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext.jsx';
import AccessibilityBar from './components/AccessibilityBar.jsx';
import React from 'react';
import DataRetentionPolicy from './pages/admin/DataRetentionPolicy.jsx';
import InstructorSageAI from './pages/instructor/SageAI.jsx';
import Insights from './pages/instructor/Insights.jsx';
import Events from './pages/instructor/Events.jsx';
import { TourProvider } from './context/TourContext.jsx';
import TourLauncher from './components/TourLauncher.jsx';

// i18n setup and language provider
import './i18n/index.js';
import { LanguageProvider } from './context/LanguageContext.jsx';

const RouterComponent = BrowserRouter;

function AccessibilityBarWrapper() {
  const { showBar } = useAccessibility();
  return showBar ? <AccessibilityBar /> : null;
}

function GlobalAccessibilityStyles() {
  const { fontSize, fontFamily, colorTheme } = useAccessibility();
  React.useEffect(() => {
    const root = document.documentElement;
    // Font size
    root.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '20px' : '16px';
    // Font family
    root.style.fontFamily = fontFamily === 'serif' ? 'serif' : 'inherit';
    // Color theme
    root.style.backgroundColor =
      colorTheme === 'high-contrast' ? '#000' :
      colorTheme === 'yellow' ? '#FFD600' :
      colorTheme === 'blue' ? '#1976D2' : '#f3f4f6';
    root.style.color =
      colorTheme === 'high-contrast' ? '#fff' : '#222';
  }, [fontSize, fontFamily, colorTheme]);
  return null;
}

function App() {
  return (
    <AccessibilityProvider>
      <GlobalAccessibilityStyles />
      <AccessibilityBarWrapper />
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <TourProvider>
              <RouterComponent>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Protected Routes */}
                  <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<StudentsManagement />} />
                    <Route path="/admin/programs" element={<ProgramManagement />} />
                    <Route path="/admin/instructors" element={<InstructorManagement />} />
                    <Route path="/admin/courses" element={<CourseManagement />} />
                    <Route path="/admin/documents" element={<DocumentManagement />} />
                    <Route path="/admin/calendar" element={<AcademicCalendar />} />
                    <Route path="/admin/notifications" element={<Notifications />} />
                    <Route path="/admin/reports" element={<Reports />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/settings" element={<SystemSettings />} />
                    <Route path="/admin/profile" element={<Profile />} />
                    <Route path="/admin/departments" element={<DepartmentDashboard />} />
                    <Route path="/admin/data-retention" element={<DataRetentionPolicy />} />
                  </Route>
                  <Route element={<PrivateRoute allowedRoles={['instructor']} />}>
                    <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                    <Route path="/instructor/profile" element={<InstructorProfile />} />
                    <Route path="/instructor/courses" element={<MyCourses />} />
                    <Route path="/instructor/students" element={<InstructorStudentsManagement />} />
                    <Route path="/instructor/assignments" element={<Assignments />} />
                    <Route path="/instructor/grades" element={<Grades />} />
                    <Route path="/instructor/calendar" element={<TeachingSchedule />} />
                    <Route path="/instructor/materials" element={<CourseMaterials />} />
                    <Route path="/instructor/messages" element={<InstructorStudentMessages />} />
                    <Route path="/instructor/notifications" element={<NotificationsInstructor />} />
                    <Route path="/instructor/sage-ai" element={<InstructorSageAI />} />
                    <Route path="/instructor/insights" element={<Insights />} />
                    <Route path="/instructor/events" element={<Events />} />
                  </Route>
                  <Route element={<PrivateRoute allowedRoles={['student']} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/student/courses" element={<StudentCourses />} />
                    <Route path="/student/assignments" element={<StudentAssignments />} />
                    <Route path="/student/grades" element={<StudentGrades />} />
                    <Route path="/student/schedule" element={<StudentSchedule />} />
                    <Route path="/student/materials" element={<StudentMaterials />} />
                    <Route path="/student/messages" element={<StudentMessages />} />
                    <Route path="/student/notifications" element={<StudentNotifications />} />
                    <Route path="/student/ecollab" element={<Ecollab />} />
                    <Route path="/student/sage-ai" element={<SageAI />} />
                    <Route path="/student/courses/:courseId/pdf/:week" element={<CoursePdfViewer />} />
                    <Route path="/student/courses/:courseId/video/:week" element={<CourseVideoViewer />} />
                    <Route path="/student/study-plan" element={<StudyPlan />} />
                    <Route path="/student/assignment-submission" element={<AssignmentSubmission />} />
                    <Route path="/student/assignment-submission/definitions" element={<DefinitionsSubmissionForm />} />
                    <Route path="/student/assignment-submission/case-briefs" element={<CaseBriefsSubmissionForm />} />
                    <Route path="/student/assignment-submission/midterm-essays" element={<MidtermEssaySubmissionForm />} />
                    <Route path="/student/assignment-submission/mini-thesis" element={<MiniThesisSubmissionForm />} />
                    <Route path="/student/check-my-vae" element={<CheckMyVAE />} />
                    <Route path="/student/zoola-report" element={<ZoolaReport />} />
                  </Route>
                </Routes>
                <TourLauncher />
              </RouterComponent>
            </TourProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  );
}

export default App;
