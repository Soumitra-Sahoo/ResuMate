import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const TemplateFive = ({ resumeData = {}, containerWidth }) => {
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
  const [baseWidth, setBaseWidth] = useState(900);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actual = resumeRef.current.offsetWidth;
      setBaseWidth(actual);
      setScale(containerWidth / actual);
    }
  }, [containerWidth]);

  const SideSection = ({ title, children }) => (
    <div className="mb-6">
      <h2 className="text-[9px] font-black tracking-[0.2em] uppercase text-violet-300 mb-3 border-b border-white/10 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );

  const MainSection = ({ title, children }) => (
    <div className="mb-7">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xs font-black tracking-widest uppercase text-gray-800 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {children}
    </div>
  );

  return (
    <div
      ref={resumeRef}
      className="bg-white font-sans flex"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        minHeight: "297mm",
      }}
    >
      {/* Dark Sidebar */}
      <div className="w-64 flex-shrink-0 bg-gray-900 text-white px-7 py-10">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-black text-white mb-5 mx-auto">
          {profileInfo.fullName?.charAt(0) || "?"}
        </div>
        <h1 className="text-lg font-bold text-white text-center mb-1 leading-tight">
          {profileInfo.fullName}
        </h1>
        <p className="text-xs text-violet-300 text-center mb-8 font-light tracking-wider">
          {profileInfo.designation}
        </p>

        {/* Contact */}
        <SideSection title="Contact">
          <div className="space-y-2">
            {contactInfo.email && (
              <p className="text-xs text-gray-300 font-light break-all">
                {contactInfo.email}
              </p>
            )}
            {contactInfo.phone && (
              <p className="text-xs text-gray-300 font-light">
                {contactInfo.phone}
              </p>
            )}
            {contactInfo.location && (
              <p className="text-xs text-gray-300 font-light">
                {contactInfo.location}
              </p>
            )}
            {contactInfo.linkedin && (
              <a
                href={contactInfo.linkedin}
                className="text-xs text-violet-300 hover:text-violet-200 block font-light"
              >
                LinkedIn
              </a>
            )}
            {contactInfo.github && (
              <a
                href={contactInfo.github}
                className="text-xs text-violet-300 hover:text-violet-200 block font-light"
              >
                GitHub
              </a>
            )}
            {contactInfo.website && (
              <a
                href={contactInfo.website}
                className="text-xs text-violet-300 hover:text-violet-200 block font-light"
              >
                Portfolio
              </a>
            )}
          </div>
        </SideSection>

        {/* Skills */}
        {skills.length > 0 && (
          <SideSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map(
                (skill, i) =>
                  skill.name && (
                    <span
                      key={i}
                      className="text-[10px] bg-white/10 text-gray-200 px-2 py-0.5 rounded-full font-light"
                    >
                      {skill.name}
                    </span>
                  ),
              )}
            </div>
          </SideSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <SideSection title="Education">
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-white">
                    {edu.degree}
                  </p>
                  <p className="text-[10px] text-gray-400 font-light">
                    {edu.institution}
                  </p>
                  <p className="text-[10px] text-gray-500 font-light">
                    {formatYearMonth(edu.startDate)} –{" "}
                    {formatYearMonth(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SideSection title="Languages">
            <div className="space-y-1">
              {languages.map(
                (lang, i) =>
                  lang.name && (
                    <p key={i} className="text-xs text-gray-300 font-light">
                      {lang.name}
                    </p>
                  ),
              )}
            </div>
          </SideSection>
        )}

        {/* Interests */}
        {interests.length > 0 && interests.some(Boolean) && (
          <SideSection title="Interests">
            <div className="space-y-1">
              {interests.filter(Boolean).map((int, i) => (
                <p key={i} className="text-xs text-gray-300 font-light">
                  · {int}
                </p>
              ))}
            </div>
          </SideSection>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 py-10">
        {/* Summary */}
        {profileInfo.summary && (
          <MainSection title="Profile">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              {profileInfo.summary}
            </p>
          </MainSection>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <MainSection title="Work Experience">
            <div className="space-y-6">
              {workExperience.map((exp, i) => (
                <div
                  key={i}
                  className="relative pl-4 border-l-2 border-violet-200"
                >
                  <div className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        {exp.role}
                      </h3>
                      <p className="text-xs text-violet-600 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-light whitespace-nowrap ml-4">
                      {formatYearMonth(exp.startDate)} –{" "}
                      {formatYearMonth(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-light mt-2">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects">
            <div className="space-y-5">
              {projects.map((proj, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-800">
                      {proj.title}
                    </h3>
                    <div className="flex gap-3 ml-4">
                      {proj.github && (
                        <a
                          href={proj.github}
                          className="text-[10px] text-violet-600 hover:underline font-medium"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {proj.liveDemo && (
                        <a
                          href={proj.liveDemo}
                          className="text-[10px] text-violet-600 hover:underline font-medium"
                        >
                          Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <MainSection title="Certifications">
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-800">
                    {cert.title}
                  </p>
                  <p className="text-[10px] text-gray-400 font-light">
                    {cert.issuer} {cert.year && `· ${cert.year}`}
                  </p>
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </div>
    </div>
  );
};

export default TemplateFive;
