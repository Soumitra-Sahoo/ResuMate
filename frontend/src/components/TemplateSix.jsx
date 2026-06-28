import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const TemplateSix = ({ resumeData = {}, containerWidth }) => {
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

  const Section = ({ title, accent = "#7c3aed", children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-1 h-5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <h2 className="text-xs font-black tracking-widest uppercase text-gray-700">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <div
      ref={resumeRef}
      className="bg-white font-sans"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
      }}
    >
      {/* Colorful Header */}
      <div className="relative px-10 pt-10 pb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-4 right-32 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-1">
              {profileInfo.fullName}
            </h1>
            <p className="text-violet-200 font-light tracking-widest text-sm uppercase">
              {profileInfo.designation}
            </p>
          </div>
          <div className="text-right space-y-1">
            {contactInfo.email && (
              <p className="text-xs text-violet-200">{contactInfo.email}</p>
            )}
            {contactInfo.phone && (
              <p className="text-xs text-violet-200">{contactInfo.phone}</p>
            )}
            {contactInfo.location && (
              <p className="text-xs text-violet-200">{contactInfo.location}</p>
            )}
          </div>
        </div>

        {/* Social links bar */}
        <div className="relative flex gap-4 mt-5 pt-4 border-t border-white/20">
          {contactInfo.linkedin && (
            <a
              href={contactInfo.linkedin}
              className="text-[10px] text-violet-200 hover:text-white font-medium tracking-wider uppercase"
            >
              LinkedIn ↗
            </a>
          )}
          {contactInfo.github && (
            <a
              href={contactInfo.github}
              className="text-[10px] text-violet-200 hover:text-white font-medium tracking-wider uppercase"
            >
              GitHub ↗
            </a>
          )}
          {contactInfo.website && (
            <a
              href={contactInfo.website}
              className="text-[10px] text-violet-200 hover:text-white font-medium tracking-wider uppercase"
            >
              Portfolio ↗
            </a>
          )}
        </div>
      </div>

      {/* Body — 2 column */}
      <div className="grid grid-cols-3 gap-8 px-10 py-8">
        {/* Left */}
        <div className="col-span-2 space-y-6">
          {profileInfo.summary && (
            <Section title="About Me">
              <p className="text-xs text-gray-600 leading-relaxed">
                {profileInfo.summary}
              </p>
            </Section>
          )}

          {workExperience.length > 0 && (
            <Section title="Experience">
              <div className="space-y-5">
                {workExperience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-semibold text-violet-600">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full whitespace-nowrap ml-3">
                        {formatYearMonth(exp.startDate)} –{" "}
                        {formatYearMonth(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects" accent="#db2777">
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div key={i} className="border-l-2 border-pink-200 pl-4">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-bold text-gray-800">
                        {proj.title}
                      </h3>
                      {proj.github && (
                        <a
                          href={proj.github}
                          className="text-[10px] text-pink-600 hover:underline"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {proj.liveDemo && (
                        <a
                          href={proj.liveDemo}
                          className="text-[10px] text-pink-600 hover:underline"
                        >
                          Demo ↗
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right */}
        <div className="col-span-1 space-y-6">
          {skills.length > 0 && (
            <Section title="Skills" accent="#0891b2">
              <div className="space-y-2">
                {skills.map(
                  (skill, i) =>
                    skill.name && (
                      <div key={i}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs text-gray-600 font-medium">
                            {skill.name}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                            style={{ width: `${skill.progress || 60}%` }}
                          />
                        </div>
                      </div>
                    ),
                )}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accent="#059669">
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="text-xs font-bold text-gray-800">
                      {edu.degree}
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      {edu.institution}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatYearMonth(edu.startDate)} –{" "}
                      {formatYearMonth(edu.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications" accent="#d97706">
              <div className="space-y-3">
                {certifications.map((cert, i) => (
                  <div key={i} className="bg-amber-50 rounded-lg p-2">
                    <p className="text-xs font-semibold text-gray-800">
                      {cert.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {cert.issuer} {cert.year && `· ${cert.year}`}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages" accent="#7c3aed">
              <div className="flex flex-wrap gap-1.5">
                {languages
                  .filter((l) => l.name)
                  .map((lang, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium"
                    >
                      {lang.name}
                    </span>
                  ))}
              </div>
            </Section>
          )}

          {interests.length > 0 && interests.some(Boolean) && (
            <Section title="Interests" accent="#7c3aed">
              <div className="flex flex-wrap gap-1.5">
                {interests.filter(Boolean).map((int, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {int}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSix;
