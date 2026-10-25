import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';

interface ResumeTemplateProps {
  data: ResumeData;
  templateType: 'classic' | 'modern' | 'minimal';
}

export const ResumePreviewDocument: React.FC<ResumeTemplateProps> = ({ data, templateType }) => {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;

  if (templateType === 'minimal') {
    return (
      <div
        id="resume-printable"
        className="bg-white text-slate-900 p-8 sm:p-10 max-w-[800px] mx-auto text-xs leading-relaxed font-sans shadow-sm"
        style={{ minHeight: '1050px' }}
      >
        {/* Minimal Tech Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            {personalInfo.fullName || 'Student Name'}
          </h1>
          <p className="text-slate-600 font-mono text-[11px] mt-1">
            {[personalInfo.email, personalInfo.phone, personalInfo.location]
              .filter(Boolean)
              .join(' • ')}
          </p>
          <div className="flex flex-wrap gap-3 font-mono text-[10px] text-slate-600 mt-1.5">
            {personalInfo.github && <span>github: {personalInfo.github}</span>}
            {personalInfo.linkedin && <span>linkedin: {personalInfo.linkedin}</span>}
            {personalInfo.portfolio && <span>web: {personalInfo.portfolio}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-5">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-mono mb-1.5">
              // PROFILE SUMMARY
            </h2>
            <p className="text-slate-700 leading-normal">{personalInfo.summary}</p>
          </div>
        )}

        {/* Education */}
        <div className="mb-5">
          <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-mono mb-2">
            // EDUCATION
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">{edu.institution}</div>
                  <div className="text-slate-700">{edu.degree}</div>
                  {edu.highlights && <div className="text-[10px] text-slate-500 mt-0.5">{edu.highlights}</div>}
                </div>
                <div className="text-right shrink-0 font-mono text-[10px] text-slate-500">
                  <div>{edu.startDate} – {edu.endDate}</div>
                  <div className="font-bold text-slate-800">{edu.gradeOrCgpa}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mb-5">
          <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-mono mb-2">
            // TECHNICAL SKILLS
          </h2>
          <div className="space-y-1">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="flex">
                <span className="w-36 font-semibold text-slate-800 shrink-0 font-mono text-[10px]">
                  {skillGroup.category}:
                </span>
                <span className="text-slate-700">{skillGroup.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mb-5">
          <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-mono mb-2">
            // TECHNICAL PROJECTS
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-mono">
                  <div className="font-bold text-slate-900 text-xs">
                    {proj.title}
                    {proj.link && (
                      <span className="text-[10px] text-slate-500 font-normal ml-2">
                        [{proj.link}]
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {proj.startDate} – {proj.endDate}
                  </div>
                </div>
                <div className="text-[10px] text-slate-600 font-mono mb-1">
                  Stack: {proj.technologies.join(', ')}
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                  {proj.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-mono mb-2">
              // EXPERIENCE & LEADERSHIP
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900">
                      {exp.role} • <span className="font-semibold text-slate-700">{exp.company}</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 mt-1">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-mono mb-1.5">
                // CERTIFICATIONS
              </h2>
              <ul className="space-y-1 text-slate-700">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> — {c.issuer} ({c.date})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-mono mb-1.5">
                // ACHIEVEMENTS
              </h2>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                {achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Classic Modern template (Default)
  return (
    <div
      id="resume-printable"
      className="bg-white text-slate-900 p-8 sm:p-10 max-w-[800px] mx-auto text-xs leading-relaxed font-sans shadow-sm"
      style={{ minHeight: '1050px' }}
    >
      {/* Header */}
      <div className="text-center border-b border-slate-300 pb-4 mb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Student Name'}
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}
        </p>
        <div className="flex justify-center items-center gap-4 text-[11px] text-indigo-700 font-medium mt-1">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Profile Summary */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-normal text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Education */}
      <div className="mb-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
          Education
        </h2>
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">{edu.institution}</span>
                <span className="text-[11px] font-medium text-slate-600">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-slate-700">
                <span>{edu.degree}</span>
                <span className="font-semibold text-slate-900">{edu.gradeOrCgpa}</span>
              </div>
              {edu.highlights && (
                <p className="text-[10px] text-slate-500 mt-0.5">{edu.highlights}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="mb-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
          Technical Skills
        </h2>
        <div className="space-y-1">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="flex">
              <span className="w-40 font-semibold text-slate-800 shrink-0">
                {skillGroup.category}:
              </span>
              <span className="text-slate-700">{skillGroup.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
          Projects
        </h2>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex justify-between items-baseline">
                <div className="font-bold text-slate-900">
                  {proj.title}{' '}
                  {proj.link && (
                    <span className="text-indigo-600 font-normal text-[10px] ml-1">
                      [{proj.link}]
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  {proj.startDate} – {proj.endDate}
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-600 mb-1">
                Technologies: {proj.technologies.join(', ')}
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-[11px]">
                {proj.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
            Experience & Responsibilities
          </h2>
          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">
                    {exp.role} • {exp.company}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 mt-1 text-[11px]">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      <div className="grid grid-cols-2 gap-4">
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
              Certifications
            </h2>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              {certifications.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong> — {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
              Key Achievements
            </h2>
            <ul className="space-y-1 text-slate-700 list-disc list-inside text-[11px]">
              {achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
