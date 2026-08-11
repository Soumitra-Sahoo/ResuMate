import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout, { useDashboardSearch } from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { LucideFilePlus, LucideTrash2, Copy, Share2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { ResumeSummaryCard } from "../components/Cards";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import Modal from "../components/Modal";
import CreateResumeForm from "../components/CreateResumeForm";
import { calculateResumeCompletion } from "../utils/helper";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden h-[400px]">
    <div className="bg-gray-200 dark:bg-gray-800 h-[260px] w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-full mt-4" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, sub, subColor = "text-gray-400" }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-lg shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{value}</p>
      {sub && <p className={`text-xs font-medium mt-0.5 ${subColor}`}>{sub}</p>}
    </div>
  </div>
);

const ResumeOverviewDonut = ({ resumes }) => {
  const segments = useMemo(() => {
    const total = resumes.length || 1;
    const completed = resumes.filter((r) => (r.completion || 0) === 100).length;
    const notStarted = resumes.filter((r) => (r.completion || 0) === 0).length;
    const inProgress = resumes.length - completed - notStarted;
    return [
      { label: "Completed", count: completed, color: "#10b981" },
      { label: "In Progress", count: inProgress, color: "#8b5cf6" },
      { label: "Not Started", count: notStarted, color: "#f97316" },
      { label: "Archived", count: 0, color: "#9ca3af" },
    ].map((s) => ({ ...s, pct: (s.count / total) * 100 }));
  }, [resumes]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4">Resume Overview</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="12" />
            {segments.map((s) => {
              if (s.pct === 0) return null;
              const dash = (s.pct / 100) * circumference;
              const el = (
                <circle
                  key={s.label}
                  cx="50" cy="50" r={radius} fill="none"
                  stroke={s.color} strokeWidth="12"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offsetAcc}
                  strokeLinecap="butt"
                />
              );
              offsetAcc += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{resumes.length}</span>
            <span className="text-[10px] text-gray-400 font-medium">Total</span>
          </div>
        </div>
        <div className="space-y-2 flex-1">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {s.count} ({Math.round(s.pct)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ImproveResumeChecklist = ({ resumes }) => {
  const items = useMemo(() => {
    const any = (fn) => resumes.some(fn);
    return [
      { label: "Add a professional summary", done: any((r) => r.profileInfo?.summary?.trim()) },
      { label: "Add more work experience", done: any((r) => r.workExperience?.some((w) => w.company && w.role)) },
      { label: "Include key skills", done: any((r) => r.skills?.some((s) => s.name?.trim())) },
      { label: "Add education details", done: any((r) => r.education?.some((e) => e.degree && e.institution)) },
      { label: "Optimize with keywords (run ATS Score)", done: false },
    ];
  }, [resumes]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4">Improve Your Resume</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300 font-medium">{item.label}</span>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                item.done
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "border-2 border-gray-200 dark:border-gray-700"
              }`}
            >
              {item.done && "✓"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ShareModal = ({ isOpen, onClose, resumeId }) => {
  const [shareUrl, setShareUrl] = useState("");
  const [status, setStatus] = useState("loading");
  const [copied, setCopied] = useState(false);

  const generateLink = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await axiosInstance.post(API_PATHS.RESUME.GENERATE_SHARE(resumeId));
      setShareUrl(res.data.shareUrl);
      setStatus("active");
    } catch {
      toast.error("Failed to generate share link");
      setStatus("error");
    }
  }, [resumeId]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => toast.error("Couldn't copy link — copy it manually"),
    );
  };

  const revokeLink = async () => {
    try {
      await axiosInstance.delete(API_PATHS.RESUME.REVOKE_SHARE(resumeId));
      setShareUrl("");
      setStatus("revoked");
      toast.success("Share link revoked");
    } catch {
      toast.error("Failed to revoke link");
    }
  };

  useEffect(() => {
    if (isOpen && resumeId) generateLink();
    else {
      setShareUrl("");
      setStatus("loading");
    }
  }, [isOpen, resumeId, generateLink]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Resume">
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Anyone with this link can view your resume (read-only).
        </p>
        {status === "loading" ? (
          <div className="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
        ) : status === "active" && shareUrl ? (
          <>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none text-gray-700 dark:text-gray-200"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <button onClick={revokeLink} className="text-xs text-red-500 hover:text-red-700 underline">
              Revoke link
            </button>
          </>
        ) : status === "revoked" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">This link has been revoked and no longer works.</p>
            <button onClick={generateLink} className="px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all">
              Generate New Link
            </button>
          </div>
        ) : (
          <p className="text-sm text-red-500">Failed to generate link.</p>
        )}
      </div>
    </Modal>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { query } = useDashboardSearch();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shareResumeId, setShareResumeId] = useState(null);

  const fetchAllResumes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      const resumesWithCompletion = response.data.map((r) => ({
        ...r,
        completion: calculateResumeCompletion(r),
      }));
      setAllResumes(resumesWithCompletion);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllResumes();
  }, [fetchAllResumes]);

  const visibleResumes = useMemo(() => {
    if (!query.trim()) return allResumes;
    const q = query.trim().toLowerCase();
    return allResumes.filter((r) => r.title?.toLowerCase().includes(q));
  }, [allResumes, query]);

  const avgCompletion = allResumes.length
    ? Math.round(allResumes.reduce((s, r) => s + (r.completion || 0), 0) / allResumes.length)
    : 0;
  const profileStrength = avgCompletion >= 70 ? "Good" : avgCompletion >= 40 ? "Average" : "Needs Work";
  const lastEdited = allResumes[0]?.updatedAt ? dayjs(allResumes[0].updatedAt).fromNow() : "—";

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
      toast.success("Resume deleted successfully");
      fetchAllResumes();
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await axiosInstance.post(API_PATHS.RESUME.DUPLICATE(id));
      toast.success("Resume duplicated!");
      fetchAllResumes();
    } catch {
      toast.error("Failed to duplicate resume");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Track your progress and create your best resume.
            </p>
          </div>
          <button
            className="group relative px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-200 dark:hover:shadow-none"
            onClick={() => setOpenCreateModal(true)}
          >
            <span className="relative flex items-center gap-2">
              Create Now <LucideFilePlus className="group-hover:translate-x-1 transition-transform" size={18} />
            </span>
          </button>
        </div>

        {/* Stats row */}
        {!loading && allResumes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="📄" label="Total Resumes" value={allResumes.length} />
            <StatCard icon="📊" label="Average Completion" value={`${avgCompletion}%`} sub="Keep going!" subColor="text-emerald-500" />
            <StatCard icon="🕒" label="Last Edited" value={lastEdited} sub="Stay consistent!" />
            <StatCard icon="🛡️" label="Profile Strength" value={profileStrength} subColor={profileStrength === "Good" ? "text-emerald-500" : "text-amber-500"} sub={profileStrength === "Good" ? "Improving is your superpower!" : "Room to grow"} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">My Resumes</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {allResumes.length > 0 ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? "s" : ""}` : "Start building your professional resume"}
                </p>
              </div>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {!loading && allResumes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl">
                <div className="bg-violet-100 dark:bg-violet-500/10 p-4 rounded-full mb-4">
                  <LucideFilePlus size={32} className="text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Resumes Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">Click "Create Now" to build your first professional resume.</p>
                <button
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl hover:scale-105 transition-all"
                  onClick={() => setOpenCreateModal(true)}
                >
                  Create Your First Resume
                </button>
              </div>
            )}

            {!loading && allResumes.length > 0 && visibleResumes.length === 0 && (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
                No resumes match "{query}"
              </div>
            )}

            {!loading && visibleResumes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-500/10 dark:to-blue-500/10 border-2 border-dashed border-violet-300 dark:border-violet-500/30 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-violet-500 min-h-[400px]"
                  onClick={() => setOpenCreateModal(true)}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mb-4">
                    <LucideFilePlus size={30} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create New Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">Start building your career</p>
                </div>

                {visibleResumes.map((resume) => (
                  <div key={resume._id} className="relative group/card">
                    <ResumeSummaryCard
                      title={resume.title}
                      createdAt={resume.createdAt}
                      updatedAt={resume.updatedAt}
                      thumbnailLink={resume.thumbnailLink}
                      onSelect={() => navigate(`/resume/${resume._id}`)}
                      onDelete={() => {
                        setResumeToDelete(resume._id);
                        setShowDeleteConfirm(true);
                      }}
                      completion={resume.completion || 0}
                    />
                    <div className="absolute bottom-[88px] left-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDuplicate(resume._id); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 shadow-sm transition-all"
                      >
                        <Copy size={12} /> Duplicate
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareResumeId(resume._id); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 shadow-sm transition-all"
                      >
                        <Share2 size={12} /> Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar widgets */}
          {!loading && allResumes.length > 0 && (
            <div className="space-y-6">
              <ResumeOverviewDonut resumes={allResumes} />
              <ImproveResumeChecklist resumes={allResumes} />
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Resume</h3>
            <button onClick={() => setOpenCreateModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
          </div>
          <CreateResumeForm
            onSuccess={() => {
              setOpenCreateModal(false);
              fetchAllResumes();
            }}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Deletion"
        showActionBtn
        actionBtnText="Delete"
        onActionClick={handleDeleteResume}
      >
        <div className="p-4 flex flex-col items-center text-center">
          <div className="bg-red-100 dark:bg-red-500/10 p-3 rounded-full mb-4">
            <LucideTrash2 className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Resume?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This action cannot be undone.</p>
        </div>
      </Modal>

      <ShareModal isOpen={!!shareResumeId} onClose={() => setShareResumeId(null)} resumeId={shareResumeId} />
    </DashboardLayout>
  );
};

export default Dashboard;