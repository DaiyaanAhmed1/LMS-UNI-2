import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { UserCircle, Camera, Mail, Phone, Briefcase, Building2, Calendar, Globe, MapPin, Key, Linkedin, Github, Activity, CheckCircle, BarChart2 } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import { useTour } from '../../context/TourContext.jsx';

const mockProfile = {
  name: 'Dr. Emily Carter',
  email: 'emily.carter@nexushive.edu',
  phone: '+1 555-123-4567',
  role: 'Instructor',
  department: 'Computer Science',
  dob: '1987-03-22',
  gender: 'Female',
  address: '456 Faculty Lane, City, Country',
  nationality: 'USA',
  linkedin: 'https://linkedin.com/in/emilycarter',
  github: 'https://github.com/emilycarter',
      lastLogin: '2025-06-10 09:45',
  profilePic: '',
  stats: { courses: 5, billsPaid: 3, activity: 92, completion: 95 }
};

export default function InstructorProfile() {
  const { t } = useTranslation();
  const { startTour } = useTour();
  const [profile, setProfile] = useState(mockProfile);
  const [pic, setPic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showBar, setShowBar } = useAccessibility();

  useEffect(() => {
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startProfileTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startProfileTour = () => {
    const steps = [
      { target: '[data-tour="instructor-profile-actions"]', title: t('instructor.tour.profile.actions.title', 'Profile & Actions'), content: t('instructor.tour.profile.actions.desc', 'Update details, change password, and access quick links.'), placement: 'left', disableBeacon: true }
    ].filter(s => document.querySelector(s.target));
    if (steps.length) startTour('instructor:profile:v1', steps);
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPic(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      alert('Password updated!');
      setPassword('');
      setConfirmPassword('');
    } else {
      alert('Passwords do not match!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role="instructor" />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
            <div className="relative mb-4">
              {pic || profile.profilePic ? (
                <img src={pic || profile.profilePic} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-600" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-600">
                  {profile.name.split(' ').map(word => word[0]).join('')}
                </div>
              )}
              <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <Camera size={18} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
              </label>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{profile.name}</h2>
            <p className="text-blue-700 dark:text-blue-400 font-medium mb-2">{profile.role}</p>
            <div className="flex flex-col items-center text-gray-500 dark:text-gray-300 text-sm mb-4">
              <span className="flex items-center gap-1"><Mail size={16} /> {profile.email}</span>
              <span className="flex items-center gap-1"><Phone size={16} /> {profile.phone}</span>
              <span className="flex items-center gap-1"><Building2 size={16} /> {profile.department}</span>
            </div>
            <div className="w-full mt-4">
              <div className="mb-2 text-xs text-gray-400 dark:text-gray-500">{t('instructor.profile.completion')}</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${profile.stats.completion}%` }}></div>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-300 mt-1">{profile.stats.completion}%</div>
            </div>
            <div className="w-full mt-6 flex flex-col gap-2" data-tour="instructor-profile-actions">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:underline"><Linkedin size={18}/> {t('instructor.profile.social.linkedin')}</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-800 dark:text-gray-100 hover:underline"><Github size={18}/> {t('instructor.profile.social.github')}</a>
              <a href="/admin/data-retention" className="mt-2 px-3 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-400 rounded-md text-sm font-semibold text-center hover:underline">{t('instructor.profile.viewDataRetention')}</a>
              <label className="flex items-center gap-2 mt-4 cursor-pointer select-none text-sm">
                <input type="checkbox" checked={showBar} onChange={e => setShowBar(e.target.checked)} className="accent-blue-600" />
                {t('instructor.profile.accessibility')}
              </label>
            </div>
          </div>

          {/* Edit Form & Widgets */}
          <div className="col-span-2 flex flex-col gap-8">
            {/* Edit Form */}
            <form className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.fullName')}</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.email')}</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.phone')}</label>
                <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.department')}</label>
                <input type="text" name="department" value={profile.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.dob')}</label>
                <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.gender')}</label>
                <select name="gender" value={profile.gender} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100">
                  <option value="">{t('instructor.profile.form.genderSelect')}</option>
                  <option value="Male">{t('instructor.profile.form.genderMale')}</option>
                  <option value="Female">{t('instructor.profile.form.genderFemale')}</option>
                  <option value="Other">{t('instructor.profile.form.genderOther')}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.address')}</label>
                <input type="text" name="address" value={profile.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.nationality')}</label>
                <input type="text" name="nationality" value={profile.nationality} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('instructor.profile.form.role')}</label>
                <input type="text" name="role" value={profile.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" disabled />
              </div>
              <div className="md:col-span-2 flex gap-4 mt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">{t('instructor.profile.form.save')}</button>
              </div>
            </form>

            {/* Password Change & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Change */}
              <form onSubmit={handlePasswordChange} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-semibold"><Key size={18}/> {t('instructor.profile.password.changeTitle')}</div>
                <input type="password" placeholder={t('instructor.profile.password.new')} value={password} onChange={e => setPassword(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" />
                <input type="password" placeholder={t('instructor.profile.password.confirm')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-900 dark:text-gray-100" />
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">{t('instructor.profile.password.update')}</button>
              </form>

              {/* Quick Stats & Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold mb-2"><Activity size={18}/> {t('instructor.profile.activity.title')}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300"><CheckCircle size={16}/> {t('instructor.profile.activity.lastLogin')}: <span className="font-medium text-gray-700 dark:text-gray-100">{profile.lastLogin}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300"><BarChart2 size={16}/> {t('instructor.profile.activity.coursesTaught')}: <span className="font-medium text-blue-700 dark:text-blue-400">{profile.stats.courses}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300"><BarChart2 size={16}/> {t('instructor.profile.activity.billsPaid')}: <span className="font-medium text-green-700 dark:text-green-400">{profile.stats.billsPaid}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300"><BarChart2 size={16}/> {t('instructor.profile.activity.score')}: <span className="font-medium text-yellow-700 dark:text-yellow-400">{profile.stats.activity}%</span></div>
                <div className="w-full mt-2">
                  <div className="mb-1 text-xs text-gray-400 dark:text-gray-500">{t('instructor.profile.activity.monthly')}</div>
                  <div className="flex items-end gap-1 h-16">
                    {[60, 80, 70, 90, 87, 75, 95].map((val, i) => (
                      <div key={i} className="flex-1 bg-blue-200 dark:bg-blue-900 rounded-t" style={{ height: `${val}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 