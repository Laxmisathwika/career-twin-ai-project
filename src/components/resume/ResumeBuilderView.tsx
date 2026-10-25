import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Layout,
  ChevronRight,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useAuth } from '../../context/AuthContext';
import { ResumePreviewDocument } from './ResumeTemplates';
import { improveResumeBullet } from '../../services/aiService';
import { jsPDF } from 'jspdf';

export const ResumeBuilderView: React.FC = () => {
  const { resume, updateResume, resetResume, serverStatus } = useCareer();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'personal' | 'education' | 'skills' | 'projects' | 'experience' | 'certifications'
  >('personal');
  const [template, setTemplate] = useState<'classic' | 'minimal'>('classic');
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // AI Bullet Improver State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [draftBullet, setDraftBullet] = useState('');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'AI & Machine Learning Engineer');
  const [isImproving, setIsImproving] = useState(false);
  const [improvedOptions, setImprovedOptions] = useState<{
    bullets: string[];
    keywords: string[];
    tips: string;
  } | null>(null);

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    const printableElement = document.getElementById('resume-printable');
    if (!printableElement) return;

    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait',
      });

      await doc.html(printableElement, {
        callback: (pdf) => {
          pdf.save(`${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_2026.pdf`);
        },
        x: 15,
        y: 15,
        width: 565,
        windowWidth: 800,
      });
    } catch (err) {
      console.warn('Direct jsPDF html renderer fallback to window.print', err);
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // AI Bullet Improver Trigger
  const handleEnhanceBullet = async () => {
    if (!draftBullet.trim()) return;
    setIsImproving(true);
    try {
      const data = await improveResumeBullet(draftBullet, targetRole);
      setImprovedOptions({
        bullets: data.improvedBullets,
        keywords: data.keywordsAdded,
        tips: data.tips,
      });
    } catch (err) {
      console.error('Failed to enhance bullet', err);
    } finally {
      setIsImproving(false);
    }
  };

  // Update Personal Info
  const handlePersonalChange = (field: string, value: string) => {
    updateResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  // Add Project
  const handleAddProject = () => {
    const newProj = {
      id: 'proj-' + Date.now(),
      title: 'New Technical Project',
      technologies: ['Python', 'FastAPI'],
      link: 'github.com/student/new-project',
      startDate: 'Jan 2026',
      endDate: 'Present',
      bullets: [
        'Developed modular microservice API handling data streaming and persistence.',
        'Implemented rigorous unit testing and automated validation checks.',
      ],
    };
    updateResume({
      ...resume,
      projects: [newProj, ...resume.projects],
    });
  };

  const handleDeleteProject = (id: string) => {
    updateResume({
      ...resume,
      projects: resume.projects.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 mb-1">
            <FileText className="w-4 h-4" />
            <span>ATS-Ready Resume Generator</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Engineering Resume Builder</h2>
          <p className="text-xs text-slate-500">
            Tailored for campus placement drives and technical screenings at VITS CSM
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Template Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setTemplate('classic')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                template === 'classic'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => setTemplate('minimal')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                template === 'minimal'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minimal
            </button>
          </div>

          {/* AI Bullet Improver Trigger */}
          <button
            onClick={() => {
              setDraftBullet('');
              setImprovedOptions(null);
              setIsAiModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Bullet Improver</span>
          </button>

          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
            className="md:hidden px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreviewMobile ? 'Edit Form' : 'Preview'}</span>
          </button>

          {/* Print & PDF Buttons */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
            title="Print via Browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Editor on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Editor Form */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            showPreviewMobile ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-2 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'personal', label: 'Contact' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'certifications', label: 'Certs & Awards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Personal & Contact */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Personal Details & Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume.personalInfo.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.personalInfo.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={resume.personalInfo.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">GitHub</label>
                  <input
                    type="text"
                    value={resume.personalInfo.github}
                    onChange={(e) => handlePersonalChange('github', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Portfolio</label>
                  <input
                    type="text"
                    value={resume.personalInfo.portfolio}
                    onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Professional Objective / Summary
                </label>
                <textarea
                  rows={3}
                  value={resume.personalInfo.summary}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="2-3 sentences highlighting your B.Tech specialization, core skills, and career objective."
                />
              </div>
            </div>
          )}

          {/* Tab 2: Education */}
          {activeTab === 'education' && (
            <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Academic Background
              </h3>

              {resume.education.map((edu, idx) => (
                <div key={edu.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx].institution = e.target.value;
                        updateResume({ ...resume, education: newEdu });
                      }}
                      className="px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                      placeholder="College / School"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx].degree = e.target.value;
                        updateResume({ ...resume, education: newEdu });
                      }}
                      className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Degree / Course"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx].startDate = e.target.value;
                        updateResume({ ...resume, education: newEdu });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Start (e.g. 2023)"
                    />
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx].endDate = e.target.value;
                        updateResume({ ...resume, education: newEdu });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="End (e.g. 2027)"
                    />
                    <input
                      type="text"
                      value={edu.gradeOrCgpa}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx].gradeOrCgpa = e.target.value;
                        updateResume({ ...resume, education: newEdu });
                      }}
                      className="px-2.5 py-1 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                      placeholder="CGPA / %"
                    />
                  </div>
                  <input
                    type="text"
                    value={edu.highlights}
                    onChange={(e) => {
                      const newEdu = [...resume.education];
                      newEdu[idx].highlights = e.target.value;
                      updateResume({ ...resume, education: newEdu });
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="Key Coursework, Rank, Honors"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Skills */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Categorized Skills
              </h3>

              {resume.skills.map((skillGroup, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={skillGroup.category}
                    onChange={(e) => {
                      const newSkills = [...resume.skills];
                      newSkills[idx].category = e.target.value;
                      updateResume({ ...resume, skills: newSkills });
                    }}
                    className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    value={skillGroup.items.join(', ')}
                    onChange={(e) => {
                      const newSkills = [...resume.skills];
                      newSkills[idx].items = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      updateResume({ ...resume, skills: newSkills });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="Separate skills with commas (e.g. Python, PyTorch, React)"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Projects */}
          {activeTab === 'projects' && (
            <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Technical Projects
                </h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {resume.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 relative">
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 pr-6">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const newP = [...resume.projects];
                        newP[pIdx].title = e.target.value;
                        updateResume({ ...resume, projects: newP });
                      }}
                      className="px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                      placeholder="Project Title"
                    />
                    <input
                      type="text"
                      value={proj.link}
                      onChange={(e) => {
                        const newP = [...resume.projects];
                        newP[pIdx].link = e.target.value;
                        updateResume({ ...resume, projects: newP });
                      }}
                      className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="GitHub URL or Live Demo"
                    />
                  </div>

                  <input
                    type="text"
                    value={proj.technologies.join(', ')}
                    onChange={(e) => {
                      const newP = [...resume.projects];
                      newP[pIdx].technologies = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      updateResume({ ...resume, projects: newP });
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="Technologies (comma separated)"
                  />

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Bullet Points (Impact & Metrics):
                    </label>
                    {proj.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center space-x-1.5">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const newP = [...resume.projects];
                            newP[pIdx].bullets[bIdx] = e.target.value;
                            updateResume({ ...resume, projects: newP });
                          }}
                          className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setDraftBullet(bullet);
                            setIsAiModalOpen(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                          title="Improve with AI"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 5: Experience */}
          {activeTab === 'experience' && (
            <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Internships & Technical Leadership
              </h3>

              {resume.experience.map((exp, idx) => (
                <div key={exp.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...resume.experience];
                        newExp[idx].role = e.target.value;
                        updateResume({ ...resume, experience: newExp });
                      }}
                      className="px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                      placeholder="Role Title"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resume.experience];
                        newExp[idx].company = e.target.value;
                        updateResume({ ...resume, experience: newExp });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Company / Student Club"
                    />
                  </div>

                  <div className="space-y-1">
                    {exp.bullets.map((b, bIdx) => (
                      <input
                        key={bIdx}
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const newExp = [...resume.experience];
                          newExp[idx].bullets[bIdx] = e.target.value;
                          updateResume({ ...resume, experience: newExp });
                        }}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 6: Certifications & Achievements */}
          {activeTab === 'certifications' && (
            <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Certifications & Accolades
              </h3>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Certifications</label>
                {resume.certifications.map((cert, idx) => (
                  <div key={cert.id} className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newC = [...resume.certifications];
                        newC[idx].name = e.target.value;
                        updateResume({ ...resume, certifications: newC });
                      }}
                      className="px-2.5 py-1 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                      placeholder="Certificate Name"
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const newC = [...resume.certifications];
                        newC[idx].issuer = e.target.value;
                        updateResume({ ...resume, certifications: newC });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Issuer"
                    />
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => {
                        const newC = [...resume.certifications];
                        newC[idx].date = e.target.value;
                        updateResume({ ...resume, certifications: newC });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Date"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700">Achievements</label>
                {resume.achievements.map((ach, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={ach}
                    onChange={(e) => {
                      const newA = [...resume.achievements];
                      newA[idx] = e.target.value;
                      updateResume({ ...resume, achievements: newA });
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Resume Preview Document */}
        <div
          className={`lg:col-span-6 ${
            showPreviewMobile ? 'block' : 'hidden lg:block'
          } overflow-x-auto`}
        >
          <div className="sticky top-20">
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300/80 shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
                <span className="font-semibold text-slate-700">
                  Live Preview ({template === 'classic' ? 'Classic Modern' : 'Minimal Tech'})
                </span>
                <span>A4 Standard</span>
              </div>
              <div className="overflow-auto max-h-[750px] rounded-lg border border-slate-300 bg-white">
                <ResumePreviewDocument data={resume} templateType={template} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Bullet Improver Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">AI Resume Bullet Improver</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Transform passive student bullet points into active, quantified, ATS-friendly
                accomplishments.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Draft Bullet Point
                </label>
                <textarea
                  rows={3}
                  value={draftBullet}
                  onChange={(e) => setDraftBullet(e.target.value)}
                  placeholder="e.g. Worked on a machine learning project for crop disease detection using PyTorch."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Engineering Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="AI & Machine Learning Engineer">AI & Machine Learning Engineer</option>
                  <option value="Full-Stack Software Development Engineer">Full-Stack SDE</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleEnhanceBullet}
                disabled={!draftBullet.trim() || isImproving}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs"
              >
                {isImproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing & Enhancing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate High-Impact Revisions</span>
                  </>
                )}
              </button>

              {improvedOptions && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800">Choose an ATS Variation:</h4>
                  <div className="space-y-2">
                    {improvedOptions.bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs hover:border-indigo-500 hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                        onClick={() => {
                          navigator.clipboard.writeText(bullet);
                          alert('Copied bullet to clipboard! Paste it into your project bullets.');
                          setIsAiModalOpen(false);
                        }}
                      >
                        <p className="text-slate-800 leading-relaxed font-medium">{bullet}</p>
                        <div className="mt-1.5 flex justify-between items-center text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Click to copy</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {improvedOptions.tips && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                      💡 Tip: {improvedOptions.tips}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
