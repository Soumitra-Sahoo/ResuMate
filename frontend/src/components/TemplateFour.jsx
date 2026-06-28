import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const TemplateFour = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actual = resumeRef.current.offsetWidth;
      setBaseWidth(actual);
      setScale(containerWidth / actual);
    }
  }, [containerWidth]);

  const Section = ({ title, children }) => (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );

  return (
    <div
      ref={resumeRef}
      className="bg-white font-sans text-gray-800"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
      }}
    >
      {/* Header */}
      <div className="px-16 pt-14 pb-10 border-b border-gray-100">
        <h1 className="text-4xl font-thin tracking-wide text-gray-900 mb-1">
          {profileInfo.fullName}
        </h1>
        <p className="text-sm text-gray-400 font-light tracking-widest uppercase mb-6">
          {profileInfo.designation}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
          {contactInfo.email && <span>{contactInfo.email}</span>}
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.location && <span>{contactInfo.location}</span>}
          {contactInfo.linkedin && (
            <a href={contactInfo.linkedin} className="hover:text-gray-600">
              LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a href={contactInfo.github} className="hover:text-gray-600">
              GitHub
            </a>
          )}
          {contactInfo.website && (
            <a href={contactInfo.website} className="hover:text-gray-600">
              Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="px-16 py-10">
        {/* Summary */}
        {profileInfo.summary && (
          <Section title="About">
            <p className="text-sm text-gray-500 leading-relaxed font-light max-w-2xl">
              {profileInfo.summary}
            </p>
          </Section>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-7">
              {workExperience.map((exp, i) => (
                <div key={i} className="grid grid-cols-4 gap-6">
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      {formatYearMonth(exp.startDate)}
                      <br />— {formatYearMonth(exp.endDate)}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
                      {exp.role}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{exp.company}</p>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            <div className="space-y-5">
              {education.map((edu, i) => (
                <div key={i} className="grid grid-cols-4 gap-6">
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400 font-light">
                      {formatYearMonth(edu.startDate)}
                      <br />— {formatYearMonth(edu.endDate)}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-gray-400 font-light">
                      {edu.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-5">
              {projects.map((proj, i) => (
                <div key={i} className="grid grid-cols-4 gap-6">
                  <div className="col-span-1">
                    {(proj.github || proj.liveDemo) && (
                      <div className="space-y-1">
                        {proj.github && (
                          <a
                            href={proj.github}
                            className="text-xs text-gray-400 hover:text-gray-600 block"
                          >
                            GitHub ↗
                          </a>
                        )}
                        {proj.liveDemo && (
                          <a
                            href={proj.liveDemo}
                            className="text-xs text-gray-400 hover:text-gray-600 block"
                          >
                            Demo ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map(
                (skill, i) =>
                  skill.name && (
                    <span
                      key={i}
                      className="text-xs text-gray-500 font-light border border-gray-200 px-3 py-1 rounded-full"
                    >
                      {skill.name}
                    </span>
                  ),
              )}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Certifications */}
          {certifications.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium text-gray-700">
                      {cert.title}
                    </p>
                    <p className="text-xs text-gray-400 font-light">
                      {cert.issuer} {cert.year && `· ${cert.year}`}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <Section title="Languages">
              <div className="space-y-1">
                {languages.map(
                  (lang, i) =>
                    lang.name && (
                      <p key={i} className="text-xs text-gray-500 font-light">
                        {lang.name}
                      </p>
                    ),
                )}
              </div>
            </Section>
          )}
        </div>

        {/* Interests */}
        {interests.length > 0 && interests.some(Boolean) && (
          <Section title="Interests">
            <p className="text-xs text-gray-400 font-light">
              {interests.filter(Boolean).join("  ·  ")}
            </p>
          </Section>
        )}
      </div>
    </div>
  );
};

export default TemplateFour;
