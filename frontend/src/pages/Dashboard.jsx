import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { LucideFilePlus, LucideTrash2, Copy, Share2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { ResumeSummaryCard } from "../components/Cards";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import Modal from "../components/Modal";
import CreateResumeForm from "../components/CreateResumeForm";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white border border-gray-200 rounded-3xl overflow-hidden h-[400px]">
    <div className="bg-gray-200 h-[260px] w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-2 bg-gray-200 rounded-full w-full mt-4" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const StatsBar = ({ resumes }) => {
  if (!resumes.length) return null;
  const avgCompletion = Math.round(
    resumes.reduce((sum, r) => sum + (r.completion || 0), 0) / resumes.length,
  );
  const lastEdited = resumes[0]?.updatedAt
    ? dayjs(resumes[0].updatedAt).fromNow()
    : "—";

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        {
          label: "Total Resumes",
          value: resumes.length,
          icon: "📄",
          color: "from-violet-500 to-fuchsia-500",
        },
        {
          label: "Avg Completion",
          value: `${avgCompletion}%`,
          icon: "📊",
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "Last Edited",
          value: lastEdited,
          icon: "🕒",
          color: "from-emerald-500 to-teal-500",
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-md`}
          >
            {stat.icon}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-lg font-black text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ShareModal = ({ isOpen, onClose, resumeId }) => {
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        API_PATHS.RESUME.GENERATE_SHARE(resumeId),
      );
      setShareUrl(res.data.shareUrl);
    } catch {
      toast.error("Failed to generate share link");
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revokeLink = async () => {
    try {
      await axiosInstance.delete(API_PATHS.RESUME.REVOKE_SHARE(resumeId));
      setShareUrl("");
      toast.success("Share link revoked");
    } catch {
      toast.error("Failed to revoke link");
    }
  };

  useEffect(() => {
    if (isOpen && resumeId) generateLink();
    else setShareUrl("");
  }, [isOpen, resumeId, generateLink]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Resume">
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Anyone with this link can view your resume (read-only).
        </p>
        {loading ? (
          <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
        ) : shareUrl ? (
          <>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <button
              onClick={revokeLink}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Revoke link
            </button>
          </>
        ) : (
          <p className="text-sm text-red-500">Failed to generate link.</p>
        )}
      </div>
    </Modal>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shareResumeId, setShareResumeId] = useState(null);

  const calculateCompletion = useCallback((resume) => {
    let done = 0,
      total = 0;
    total += 3;
    if (resume.profileInfo?.fullName) done++;
    if (resume.profileInfo?.designation) done++;
    if (resume.profileInfo?.summary) done++;
    total += 2;
    if (resume.contactInfo?.email) done++;
    if (resume.contactInfo?.phone) done++;
    resume.workExperience?.forEach((e) => {
      total += 5;
      if (e.company) done++;
      if (e.role) done++;
      if (e.startDate) done++;
      if (e.endDate) done++;
      if (e.description) done++;
    });
    resume.education?.forEach((e) => {
      total += 4;
      if (e.degree) done++;
      if (e.institution) done++;
      if (e.startDate) done++;
      if (e.endDate) done++;
    });
    resume.skills?.forEach((s) => {
      total += 1;
      if (s.name) done++;
    });
    resume.projects?.forEach((p) => {
      total += 4;
      if (p.title) done++;
      if (p.description) done++;
      if (p.github) done++;
      if (p.liveDemo) done++;
    });
    resume.certifications?.forEach((c) => {
      total += 3;
      if (c.title) done++;
      if (c.issuer) done++;
      if (c.year) done++;
    });
    resume.languages?.forEach(l => { total += 1; if (l.name) done++ });
    total += resume.interests?.length || 0;
    done += resume.interests?.filter((i) => i?.trim() !== "")?.length || 0;
    return Math.round((done / total) * 100);
  }, []);

  const fetchAllResumes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      const resumesWithCompletion = response.data.map((r) => ({
        ...r,
        completion: calculateCompletion(r),
      }));
      setAllResumes(resumesWithCompletion);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateCompletion]);

  useEffect(() => {
    fetchAllResumes();
  }, [fetchAllResumes]);

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
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600">
              {allResumes.length > 0
                ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? "s" : ""}`
                : "Start building your professional resume"}
            </p>
          </div>
          <button
            className="group relative px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-200"
            onClick={() => setOpenCreateModal(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-3">
              Create Now{" "}
              <LucideFilePlus
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </span>
          </button>
        </div>

        {/* Stats Bar */}
        {!loading && <StatsBar resumes={allResumes} />}

        {/* Skeleton loaders */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && allResumes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-violet-100 p-4 rounded-full mb-4">
              <LucideFilePlus size={32} className="text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Resumes Yet
            </h3>
            <p className="text-gray-600 max-w-md mb-6">
              Click "Create Now" to build your first professional resume.
            </p>
            <button
              className="group relative px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105"
              onClick={() => setOpenCreateModal(true)}
            >
              <span className="relative flex items-center gap-3">
                Create Your First Resume <LucideFilePlus size={20} />
              </span>
            </button>
          </div>
        )}

        {/* Resume Grid */}
        {!loading && allResumes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-dashed border-violet-300 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-violet-500 min-h-[400px]"
              onClick={() => setOpenCreateModal(true)}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mb-4">
                <LucideFilePlus size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Create New Resume
              </h3>
              <p className="text-gray-600 text-center">
                Start building your career
              </p>
            </div>

            {allResumes.map((resume) => (
              <div key={resume._id} className="relative group/card">
                <ResumeSummaryCard
                  title={resume.title}
                  createdAt={resume.createdAt}
                  updatedAt={resume.updatedAt}
                  onSelect={() => navigate(`/resume/${resume._id}`)}
                  onDelete={() => {
                    setResumeToDelete(resume._id);
                    setShowDeleteConfirm(true);
                  }}
                  completion={resume.completion || 0}
                />
                {/* Duplicate + Share buttons on hover */}
                <div className="absolute bottom-[88px] left-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(resume._id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-violet-50 hover:text-violet-700 shadow-sm transition-all"
                  >
                    <Copy size={12} /> Duplicate
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareResumeId(resume._id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-700 shadow-sm transition-all"
                  >
                    <Share2 size={12} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Create New Resume
            </h3>
            <button
              onClick={() => setOpenCreateModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
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
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <LucideTrash2 className="text-orange-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Delete Resume?
          </h3>
          <p className="text-gray-600 mb-4">This action cannot be undone.</p>
        </div>
      </Modal>

      {/* Share Modal */}
      <ShareModal
        isOpen={!!shareResumeId}
        onClose={() => setShareResumeId(null)}
        resumeId={shareResumeId}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
