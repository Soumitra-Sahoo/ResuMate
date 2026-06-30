"use client";

import { useState } from "react";
import { Input } from "./Input";
import { RatingInput } from "./ResumeSection";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const card = "bg-white border border-gray-100 rounded-2xl p-6 shadow-sm";
const heading = "text-xl font-black text-slate-800 mb-6";
const sectionLabel = "block text-sm font-bold text-slate-700 mb-3";
const textarea = "w-full text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all";
const trashBtn = "flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all";
const addBtn = "flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border-2 border-dashed transition-all";

// ─── Generic AI Improve Button (reusable) ─────────────────────────────────────
const AIImproveButton = ({ text, context = {}, endpoint, onImproved, label = "✨ Improve with AI" }) => {
    const [loading, setLoading] = useState(false);

    const handleImprove = async () => {
        if (!text?.trim()) {
            toast.error("Write something first before improving with AI");
            return;
        }
        setLoading(true);
        const toastId = toast.loading("AI is improving your text…");
        try {
            const res = await axiosInstance.post(endpoint, { text, ...context });
            onImproved(res.data.improved);
            toast.success("Improved successfully!", { id: toastId });
        } catch {
            toast.error("AI request failed. Try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button type="button" onClick={handleImprove} disabled={loading}
            className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:scale-105 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            {loading ? "Improving…" : label}
        </button>
    );
};

export const ProfileInfoForm = ({ profileData, updateSection }) => (
    <div className={card}>
        <h2 className={heading}>Profile Information</h2>
        <div className="space-y-5">
            <Input label="Full Name" placeholder="John Doe" value={profileData.fullName || ""}
                onChange={({ target }) => updateSection("fullName", target.value)} />
            <Input label="Designation" placeholder="Senior Software Developer" value={profileData.designation || ""}
                onChange={({ target }) => updateSection("designation", target.value)} />
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className={sectionLabel}>Professional Summary</label>
                    <AIImproveButton
                        text={profileData.summary}
                        context={{ designation: profileData.designation }}
                        endpoint={API_PATHS.AI.IMPROVE_SUMMARY}
                        onImproved={(improved) => updateSection("summary", improved)}
                    />
                </div>
                <textarea
                    className={textarea}
                    rows={5}
                    placeholder="Short introduction about yourself"
                    value={profileData.summary || ""}
                    onChange={({ target }) => updateSection("summary", target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                    💡 Write a draft first, then click ✨ Improve with AI for a concise, punchy version
                </p>
            </div>
        </div>
    </div>
);

export const ProjectDetailForm = ({ projectInfo, updateArrayItem, addArrayItem, removeArrayItem }) => (
    <div className={card}>
        <h2 className={heading}>Projects</h2>
        <div className="space-y-6 mb-6">
            {projectInfo.map((project, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Input label="Project Title" placeholder="Portfolio Website" value={project.title || ""}
                                onChange={({ target }) => updateArrayItem(index, "title", target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-3">
                                <label className={sectionLabel}>Description</label>
                                <AIImproveButton
                                    text={project.description}
                                    context={{ title: project.title }}
                                    endpoint={API_PATHS.AI.IMPROVE_PROJECT}
                                    onImproved={(improved) => updateArrayItem(index, "description", improved)}
                                />
                            </div>
                            <textarea
                                className={textarea}
                                rows={3}
                                placeholder="Short description about the project"
                                value={project.description || ""}
                                onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                            />
                        </div>
                        <Input label="GitHub Link" placeholder="https://github.com/username/project" value={project.github || ""}
                            onChange={({ target }) => updateArrayItem(index, "github", target.value)} />
                        <Input label="Live Demo URL" placeholder="https://yourproject.live" value={project.liveDemo || ""}
                            onChange={({ target }) => updateArrayItem(index, "liveDemo", target.value)} />
                    </div>
                    {projectInfo.length > 1 && (
                        <button type="button" className={`${trashBtn} mt-4`} onClick={() => removeArrayItem(index)}>
                            <Trash2 size={14} /> Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className={`${addBtn} border-fuchsia-300 text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-500`}
                onClick={() => addArrayItem({ title: "", description: "", github: "", liveDemo: "" })}>
                <Plus size={16} /> Add Project
            </button>
        </div>
    </div>
);

export const AdditionalInfoForm = ({ languages, interests, updateArrayItem, addArrayItem, removeArrayItem }) => (
    <div className={card}>
        <h2 className={heading}>Additional Information</h2>
        <div className="mb-10">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-700 mb-5">
                <div className="w-2 h-2 rounded-full bg-violet-500" /> Languages
            </h3>
            <div className="space-y-6">
                {languages?.map((lang, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <Input label="Language" placeholder="e.g. English" value={lang.name || ""}
                                onChange={({ target }) => updateArrayItem("languages", index, "name", target.value)} />
                            <div>
                                <label className={sectionLabel}>Proficiency</label>
                                <RatingInput value={lang.progress || 0} total={5} color="#8b5cf6" bgColor="#e2e8f0"
                                    onChange={(v) => updateArrayItem("languages", index, "progress", v)} />
                            </div>
                        </div>
                        {languages.length > 1 && (
                            <button type="button" className={`${trashBtn} mt-4`} onClick={() => removeArrayItem("languages", index)}>
                                <Trash2 size={14} /> Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" className={`${addBtn} border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-500`}
                    onClick={() => addArrayItem("languages", { name: "", progress: 0 })}>
                    <Plus size={16} /> Add Language
                </button>
            </div>
        </div>
        <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-700 mb-5">
                <div className="w-2 h-2 rounded-full bg-orange-400" /> Interests
            </h3>
            <div className="space-y-4">
                {interests?.map((interest, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                            <Input placeholder="e.g. Reading, Photography" value={interest || ""}
                                onChange={({ target }) => updateArrayItem("interests", index, null, target.value)} />
                        </div>
                        {interests.length > 1 && (
                            <button type="button" className={trashBtn} onClick={() => removeArrayItem("interests", index)}>
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" className={`${addBtn} border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-500`}
                    onClick={() => addArrayItem("interests", "")}>
                    <Plus size={16} /> Add Interest
                </button>
            </div>
        </div>
    </div>
);

export const CertificationInfoForm = ({ certifications, updateArrayItem, addArrayItem, removeArrayItem }) => (
    <div className={card}>
        <h2 className={heading}>Certifications</h2>
        <div className="space-y-6 mb-6">
            {certifications.map((cert, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Certificate Title" placeholder="Full Stack Web Developer" value={cert.title || ""}
                            onChange={({ target }) => updateArrayItem(index, "title", target.value)} />
                        <Input label="Issuer" placeholder=" Google / IBM etc." value={cert.issuer || ""}
                            onChange={({ target }) => updateArrayItem(index, "issuer", target.value)} />
                        <Input label="Year" placeholder="2026" value={cert.year || ""}
                            onChange={({ target }) => updateArrayItem(index, "year", target.value)} />
                    </div>
                    {certifications.length > 1 && (
                        <button type="button" className={`${trashBtn} mt-4`} onClick={() => removeArrayItem(index)}>
                            <Trash2 size={14} /> Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className={`${addBtn} border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500`}
                onClick={() => addArrayItem({ title: "", issuer: "", year: "" })}>
                <Plus size={16} /> Add Certification
            </button>
        </div>
    </div>
);

export const ContactInfoForm = ({ contactInfo, updateSection }) => (
    <div className={card}>
        <h2 className={heading}>Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <Input label="Address" placeholder="Short Address" value={contactInfo.location || ""}
                    onChange={({ target }) => updateSection("location", target.value)} />
            </div>
            <Input label="Email" placeholder="example@mail.com" type="email" value={contactInfo.email || ""}
                onChange={({ target }) => updateSection("email", target.value)} />
            <Input label="Phone Number" placeholder="xxx xxx xxxx" value={contactInfo.phone || ""}
                onChange={({ target }) => updateSection("phone", target.value)} />
            <Input label="LinkedIn" placeholder="https://linkedin.com/in/username" value={contactInfo.linkedin || ""}
                onChange={({ target }) => updateSection("linkedin", target.value)} />
            <Input label="GitHub" placeholder="https://github.com/username" value={contactInfo.github || ""}
                onChange={({ target }) => updateSection("github", target.value)} />
            <div className="md:col-span-2">
                <Input label="Portfolio / Website" placeholder="https://yourwebsite.live" value={contactInfo.website || ""}
                    onChange={({ target }) => updateSection("website", target.value)} />
            </div>
        </div>
    </div>
);

export const EducationDetailsForm = ({ educationInfo, updateArrayItem, addArrayItem, removeArrayItem }) => (
    <div className={card}>
        <h2 className={heading}>Education</h2>
        <div className="space-y-6 mb-6">
            {educationInfo.map((edu, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Degree" placeholder="Bachelor of Technology" value={edu.degree || ""}
                            onChange={({ target }) => updateArrayItem(index, "degree", target.value)} />
                        <Input label="Institution" placeholder="MIT / IIT  etc." value={edu.institution || ""}
                            onChange={({ target }) => updateArrayItem(index, "institution", target.value)} />
                        <Input label="Start Date" type="date" value={edu.startDate ? `${edu.startDate}-01` : ""}
                            onChange={({ target }) => updateArrayItem(index, "startDate", target.value.slice(0, 7))} min="1900-01-01" />
                        <Input label="End Date" type="date" value={edu.endDate ? `${edu.endDate}-01` : ""}
                            onChange={({ target }) => updateArrayItem(index, "endDate", target.value.slice(0, 7))} min="1900-01-01" />
                    </div>
                    {educationInfo.length > 1 && (
                        <button type="button" className={`${trashBtn} mt-4`} onClick={() => removeArrayItem(index)}>
                            <Trash2 size={14} /> Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className={`${addBtn} border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500`}
                onClick={() => addArrayItem({ degree: "", institution: "", startDate: "", endDate: "" })}>
                <Plus size={16} /> Add Education
            </button>
        </div>
    </div>
);

export const SkillsInfoForm = ({ skillsInfo, updateArrayItem, addArrayItem, removeArrayItem }) => (
    <div className={card}>
        <h2 className={heading}>Skills</h2>
        <div className="space-y-6 mb-6">
            {skillsInfo.map((skill, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Skill Name" placeholder="JavaScript" value={skill.name || ""}
                            onChange={({ target }) => updateArrayItem(index, "name", target.value)} />
                        <div>
                            <label className={sectionLabel}>
                                Proficiency ({skill.progress ? Math.round(skill.progress / 20) : 0}/5)
                            </label>
                            <div className="mt-2">
                                <RatingInput value={skill.progress || 0} total={5} color="#f59e0b" bgColor="#e2e8f0"
                                    onChange={(v) => updateArrayItem(index, "progress", v)} />
                            </div>
                        </div>
                    </div>
                    {skillsInfo.length > 1 && (
                        <button type="button" className={`${trashBtn} mt-4`} onClick={() => removeArrayItem(index)}>
                            <Trash2 size={14} /> Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className={`${addBtn} border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-500`}
                onClick={() => addArrayItem({ name: "", progress: 0 })}>
                <Plus size={16} /> Add Skill
            </button>
        </div>
    </div>
);

export const WorkExperienceForm = ({ workExperience, updateArrayItem, addArrayItem, removeArrayItem }) => (
    <div className={card}>
        <h2 className={heading}>Work Experience</h2>
        <div className="space-y-6 mb-6">
            {workExperience.map((exp, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Company" placeholder="ABC Corp" value={exp.company || ""}
                            onChange={({ target }) => updateArrayItem(index, "company", target.value)} />
                        <Input label="Role" placeholder="Frontend Developer" value={exp.role || ""}
                            onChange={({ target }) => updateArrayItem(index, "role", target.value)} />
                        <Input label="Start Date" type="date" value={exp.startDate ? `${exp.startDate}-01` : ""}
                            onChange={({ target }) => updateArrayItem(index, "startDate", target.value.slice(0, 7))} min="1900-01-01" />
                        <Input label="End Date" type="date" value={exp.endDate ? `${exp.endDate}-01` : ""}
                            onChange={({ target }) => updateArrayItem(index, "endDate", target.value.slice(0, 7))} min="1900-01-01" />
                    </div>
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className={sectionLabel}>Description</label>
                            <AIImproveButton
                                text={exp.description}
                                context={{ role: exp.role, company: exp.company }}
                                endpoint={API_PATHS.AI.IMPROVE_BULLET}
                                onImproved={(improved) => updateArrayItem(index, "description", improved)}
                            />
                        </div>
                        <textarea
                            className={textarea}
                            rows={4}
                            placeholder={"What did you do in this role?\nTip: Write your description then click ✨ Improve with AI"}
                            value={exp.description || ""}
                            onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            💡 Write your raw description first, then use AI to make it ATS-friendly
                        </p>
                    </div>
                    {workExperience.length > 1 && (
                        <button type="button" className={`${trashBtn} mt-4`} onClick={() => removeArrayItem(index)}>
                            <Trash2 size={14} /> Remove Experience
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className={`${addBtn} border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-500`}
                onClick={() => addArrayItem({ company: "", role: "", startDate: "", endDate: "", description: "" })}>
                <Plus size={16} /> Add Work Experience
            </button>
        </div>
    </div>
);