import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const TemplateSeven = ({ resumeData = {}, containerWidth }) => {
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
    <div className="mb-5">
      <div className="border-b-2 border-gray-800 mb-3">
        <h2 className="text-xs font-black tracking-widest uppercase text-gray-800 pb-1">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <div
      ref={resumeRef}
      className="bg-white font-serif text-gray-900"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
      }}
    >
      {/* Header — centered, formal */}
      <div className="text-center px-12 pt-12 pb-6 border-b-2 border-gray-800">
        <h1 className="text-3xl font-black tracking-widest uppercase text-gray-900 mb-2">
          {profileInfo.fullName}
        </h1>
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
          {profileInfo.designation}
        </p>
        {/* Contact row */}
        <div className="h-contacts">
    {contactInfo.email && <span>{contactInfo.email}</span>}
    {contactInfo.email && contactInfo.phone && <span className="h-sep">|</span>}
    {contactInfo.phone && <span>{contactInfo.phone}</span>}
    {contactInfo.phone && contactInfo.location && <span className="h-sep">|</span>}
    {contactInfo.location && <span>{contactInfo.location}</span>}
    {contactInfo.location && contactInfo.linkedin && <span className="h-sep">|</span>}
    {contactInfo.linkedin && <span>LinkedIn</span>}
    {contactInfo.linkedin && contactInfo.github && <span className="h-sep">|</span>}
    {contactInfo.github && <span>GitHub</span>}
    {contactInfo.github && contactInfo.website && <span className="h-sep">|</span>}
    {contactInfo.website && <span>Portfolio</span>}
</div>
      </div>

      <div className="px-12 py-8">
        {/* Summary */}
        {profileInfo.summary && (
          <Section title="Professional Summary">
            <p className="text-xs text-gray-700 leading-relaxed text-justify">
              {profileInfo.summary}
            </p>
          </Section>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <Section title="Professional Experience">
            <div className="space-y-5">
              {workExperience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {exp.role}
                    </h3>
                    <span className="text-xs text-gray-500 italic">
                      {formatYearMonth(exp.startDate)} –{" "}
                      {formatYearMonth(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 italic mb-2">
                    {exp.company}
                  </p>
                  {exp.description && (
                    <ul className="space-y-1">
                      {exp.description.split("\n").map(
                        (line, j) =>
                          line.trim() && (
                            <li
                              key={j}
                              className="text-xs text-gray-700 leading-relaxed flex gap-2"
                            >
                              <span className="text-gray-400 mt-0.5 flex-shrink-0">
                                ▪
                              </span>
                              <span>{line}</span>
                            </li>
                          ),
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-xs italic text-gray-600">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 italic whitespace-nowrap ml-4">
                    {formatYearMonth(edu.startDate)} –{" "}
                    {formatYearMonth(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Two column bottom */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            {skills.length > 0 && (
              <Section title="Core Competencies">
                <div className="space-y-2">
                  {[
                    "Languages",
                    "Frameworks",
                    "Tools",
                    "Soft Skills",
                    "Other",
                  ].map((cat) => {
                    const items = skills.filter(
                      (s) => (s.category || "Other") === cat && s.name,
                    );
                    if (!items.length) return null;
                    return (
                      <p key={cat} className="text-xs text-gray-700">
                        <span className="font-bold">{cat}: </span>
                        {items.map((s) => s.name).join(", ")}
                      </p>
                    );
                  })}
                </div>
              </Section>
            )}

            {certifications.length > 0 && (
              <Section title="Certifications">
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <div key={i}>
                      <p className="text-xs font-semibold text-gray-800">
                        {cert.title}
                      </p>
                      <p className="text-[10px] text-gray-500 italic">
                        {cert.issuer}
                        {cert.year && ` · ${cert.year}`}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <div>
            {projects.length > 0 && (
              <Section title="Key Projects">
                <div className="space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-gray-800">
                          {proj.title}
                        </h3>
                        {proj.github && (
                          <a
                            href={proj.github}
                            className="text-[10px] text-gray-500 hover:text-gray-700 italic"
                          >
                            (GitHub)
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-600 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {(languages.length > 0 ||
              (interests.length > 0 && interests.some(Boolean))) && (
              <Section title="Additional Information">
                {languages.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Languages:{" "}
                    </span>
                    <span className="text-xs text-gray-600">
                      {languages
                        .filter((l) => l.name)
                        .map((l) => l.name)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {interests.some(Boolean) && (
                  <div>
                    <span className="text-xs font-semibold text-gray-700">
                      Interests:{" "}
                    </span>
                    <span className="text-xs text-gray-600">
                      {interests.filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSeven;
