import React from 'react'
import { ExternalLink, Github } from 'lucide-react'

export const Progress = ({ progress, color }) => (
    <div className="w-20 h-2 rounded-full bg-gray-200">
        <div className="h-full rounded-full transition-all"
            style={{ width: `${progress * 20}%`, backgroundColor: color }} />
    </div>
)

export const ActionLink = ({ icon, link, bgColor }) => (
    <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center rounded-full"
            style={{ backgroundColor: bgColor }}>
            {icon}
        </div>
        <p className="text-sm font-medium underline cursor-pointer break-all text-gray-600 hover:text-emerald-600 transition-colors">
            {link}
        </p>
    </div>
)

export const CertificationInfo = ({ title, issuer, year, bgColor }) => (
    <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
            {year && (
                <div className="text-xs font-bold text-white px-3 py-1 rounded-lg"
                    style={{ backgroundColor: bgColor }}>
                    {year}
                </div>
            )}
            <p className="text-sm text-gray-600 font-medium">{issuer}</p>
        </div>
    </div>
)

export const ContactInfo = ({ icon, iconBG, value }) => (
    <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: iconBG }}>
            {icon}
        </div>
        <p className="flex-1 text-sm font-medium break-all text-gray-700">{value}</p>
    </div>
)

export const EducationInfo = ({ degree, institution, duration }) => (
    <div className="mb-5">
        <h3 className="text-base font-semibold pb-2 text-gray-900">{degree}</h3>
        <p className="text-sm text-gray-700 font-medium">{institution}</p>
        <p className="text-xs text-gray-500 font-medium italic mt-1">{duration}</p>
    </div>
)

const InfoBlock = ({ label, progress, accentColor }) => (
    <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {progress > 0 && <Progress progress={(progress / 100) * 5} color={accentColor} />}
    </div>
)

export const LanguageSection = ({ languages, accentColor }) => (
    <div>
        {languages.map((lang, idx) => (
            <InfoBlock key={idx} label={lang.name} progress={lang.progress} accentColor={accentColor} />
        ))}
    </div>
)

export const SkillSection = ({ skills, accentColor }) => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-5">
        {skills.map((skill, idx) => (
            <InfoBlock key={idx} label={skill.name} progress={skill.progress} accentColor={accentColor} />
        ))}
    </div>
)

export const ProjectInfo = ({ title, description, githubLink, liveDemoUrl, isPreview }) => (
    <div className="mb-5">
        <h3 className={`${isPreview ? 'text-sm' : 'text-base'} font-semibold text-gray-900`}>{title}</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
        <div className="flex items-center gap-4 font-medium mt-3">
            {githubLink && (
                <a href={githubLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-blue-600">
                    <Github size={16} /><span>GitHub</span>
                </a>
            )}
            {liveDemoUrl && (
                <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-blue-600">
                    <ExternalLink size={16} /><span>Live Demo</span>
                </a>
            )}
        </div>
    </div>
)

export const RatingInput = ({ value = 0, total = 5, onChange = () => { }, color = '#10b981', bgColor = '#e5e7eb' }) => {
    const displayValue = Math.round((value / 100) * total)
    return (
        <div className="flex gap-2 cursor-pointer">
            {[...Array(total)].map((_, idx) => (
                <div
                    key={idx}
                    onClick={() => onChange(Math.round(((idx + 1) / total) * 100))}
                    className="w-4 h-4 rounded transition-all hover:scale-110"
                    style={{ backgroundColor: idx < displayValue ? color : bgColor }}
                />
            ))}
        </div>
    )
}

export const WorkExperience = ({ company, role, duration, durationColor, description }) => (
    <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
            <div>
                <h3 className="text-base font-semibold pb-2 text-gray-900">{company}</h3>
                <p className="text-base font-medium text-gray-700">{role}</p>
            </div>
            <p className="text-sm font-bold italic" style={{ color: durationColor }}>{duration}</p>
        </div>
        <p className="text-sm text-gray-600 font-medium leading-relaxed">{description}</p>
    </div>
)