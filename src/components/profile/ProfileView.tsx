import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Save,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Award,
  Layers,
  X,
  ShieldCheck,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, authConfig, logout } = useAuth();
  const { serverStatus } = useCareer();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');
  const [college, setCollege] = useState(user?.college || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [cgpa, setCgpa] = useState(user?.cgpa !== undefined ? user.cgpa.toString() : '8.50');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsStr, setSkillsStr] = useState(user?.skills?.join(', ') || '');
  const [interestsStr, setInterestsStr] = useState(user?.interests?.join(', ') || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever user changes or page is revisited
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setRollNumber(user.rollNumber || '');
      setCollege(user.college || '');
      setDepartment(user.department || '');
      setSemester(user.semester || '');
      setCgpa(user.cgpa !== undefined ? user.cgpa.toString() : '');
      setTargetRole(user.targetRole || '');
      setBio(user.bio || '');
      setSkillsStr(user.skills ? user.skills.join(', ') : '');
      setInterestsStr(user.interests ? user.interests.join(', ') : '');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setPortfolioUrl(user.portfolioUrl || '');
    } else {
      setFullName('');
      setEmail('');
      setRollNumber('');
      setCollege('');
      setDepartment('');
      setSemester('');
      setCgpa('');
      setTargetRole('');
      setBio('');
      setSkillsStr('');
      setInterestsStr('');
      setGithubUrl('');
      setLinkedinUrl('');
      setPortfolioUrl('');
    }
  }, [user]);

  // Cancel / Discard unsaved changes
  const handleCancel = () => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setRollNumber(user.rollNumber || '');
      setCollege(user.college || '');
      setDepartment(user.department || '');
      setSemester(user.semester || '');
      setCgpa(user.cgpa !== undefined ? user.cgpa.toString() : '');
      setTargetRole(user.targetRole || '');
      setBio(user.bio || '');
      setSkillsStr(user.skills ? user.skills.join(', ') : '');
      setInterestsStr(user.interests ? user.interests.join(', ') : '');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setPortfolioUrl(user.portfolioUrl || '');
    }
    setErrorMsg('');
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSavedSuccess(false);

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Full Name must be at least 2 characters long.');
      return;
    }

    const trimmedRoll = rollNumber.trim().toUpperCase();
    if (!trimmedRoll || trimmedRoll.length < 3) {
      setErrorMsg('Please enter a valid Roll Number.');
      return;
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      setErrorMsg('Please enter a valid CGPA between 0.00 and 10.00.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({
        fullName: trimmedName,
        rollNumber: trimmedRoll,
        college: college.trim(),
        department: department.trim(),
        semester: semester.trim(),
        cgpa: parsedCgpa,
        targetRole: targetRole.trim(),
        bio: bio.trim(),
        skills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
        interests: interestsStr.split(',').map((s) => s.trim()).filter(Boolean),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
      });

      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setErrorMsg(res.error || 'Failed to save profile changes.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBackup = () => {
    if (!user) return;
    const data = {
      profile: user,
      exportedAt: new Date().toISOString(),
      institution: 'Vignan Institute of Technology and Science, Deshmukhi',
      department: user.department,
      academicYear: '2026–2027',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Career_Twin_${user.rollNumber || 'student'}_profile.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-800 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/10">
            {fullName ? fullName.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{fullName || 'Student Profile'}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Active Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll No: <strong>{rollNumber}</strong> • {department}
            </p>
            <p className="text-[11px] text-indigo-600 font-medium">
              Vignan Institute of Technology and Science • 2026–2027
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Profile changes saved successfully! Updates persist across page refreshes and sessions.
            </span>
          </div>
        )}

        {/* Section 1: Academic Identity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Academic Identity (VITS CSM)
            </h3>
            <span className="text-[11px] text-slate-400">Account ID: {user?.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                title="Account email cannot be modified"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number *</label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current CGPA *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Career Targets & Skills */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            2. Career Objective & Skills
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="e.g. AI & Machine Learning Engineer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Skills (Comma separated)
              </label>
              <textarea
                rows={2}
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="Python, PyTorch, React, TypeScript, FastAPI, PostgreSQL, Docker"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Interests
              </label>
              <input
                type="text"
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="Generative AI, Large Language Models, Distributed Systems"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bio / About Me
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Portfolio & Web Presence */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            3. Portfolio & Social Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio</label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: Cancel and Save Changes */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel & Discard Changes</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Account & Session Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Account & Active Session</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as <strong className="text-slate-800">{user?.fullName || 'Active Student'}</strong> ({user?.email})
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 transition-colors shadow-2xs cursor-pointer"
            title="Sign out of student account"
          >
            <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
