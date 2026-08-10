import React from 'react'
import { ExternalLink, Github } from 'lucide-react'

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

export const EducationInfo = ({ degree, institution, duration }) => (
    <div className="mb-5">
        <h3 className="text-base font-semibold pb-2 text-gray-900">{degree}</h3>
        <p className="text-sm text-gray-700 font-medium">{institution}</p>
        <p className="text-xs text-gray-500 font-medium italic mt-1">{duration}</p>
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