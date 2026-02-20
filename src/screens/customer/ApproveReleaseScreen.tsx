import { useParams, useNavigate } from "react-router-dom";
import { Shield, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useProjects } from "../../context/ProjectsContext";
import { useApp } from "../../context/AppContext";
import { findUserById } from "../../data/users";
import type { Contractor } from "../../types";
import TopBar from "../../components/layout/TopBar";
import Avatar from "../../components/ui/Avatar";
import { formatCurrency } from "../../utils/formatters";

const ISSUE_OPTIONS = [
  { key: "notCompleted", labelKey: "release.issueWork" },
  { key: "quality", labelKey: "release.issueQuality" },
  { key: "ghosted", labelKey: "release.issueGhosted" },
  { key: "damage", labelKey: "release.issueDamage" },
  { key: "other", labelKey: "release.issueOther" },
];

export default function ApproveReleaseScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, approveRelease, raiseIssue } = useProjects();
  const { t } = useApp();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"approved" | "issue" | null>(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [issueDetails, setIssueDetails] = useState("");
  const [photoIndex, setPhotoIndex] = useState(0);

  const project = getProject(id ?? "");
  if (!project) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title={t("release.title")} back />
        <div className="flex-1 flex items-center justify-center text-gray-400">{t("detail.projectNotFound")}</div>
      </div>
    );
  }

  const acceptedQuote = project.quotes.find((q) => q.id === project.acceptedQuoteId);
  const contractor = acceptedQuote
    ? (findUserById(acceptedQuote.contractorId) as Contractor | null)
    : null;

  // Before photo comes from project.photos[0], after from completionPhotos[0]
  const beforePhoto = project.photos?.[0];
  const afterPhoto = project.completionPhotos?.[0];
  const allCompletionPhotos = project.completionPhotos ?? [];

  const handleApprove = () => {
    setLoading(true);
    setTimeout(() => {
      approveRelease(project.id);
      setDone("approved");
      setLoading(false);
    }, 1200);
  };

  const toggleIssue = (key: string) => {
    setSelectedIssues((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleIssueSubmit = () => {
    raiseIssue(project.id);
    setDone("issue");
  };

  if (done === "approved") {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <TopBar title={t("release.successTitle")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 scale-in">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900 mb-2">{t("release.successTitle")}</h2>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-2 max-w-xs">
            <span className="font-bold text-gray-700">{formatCurrency(project.escrowAmount ?? 0)}</span> {t("release.successSub")} {contractor?.businessName ?? "the contractor"}.
          </p>
          <p className="text-gray-400 text-[12px] mb-8">{t("release.fundsArrival")}</p>
          <button
            onClick={() => navigate(`/project/${project.id}/review`)}
            className="w-full bg-amber-500 text-white font-bold py-4 rounded-2xl text-[15px] pressable mb-3"
          >
            ⭐ {t("btn.leaveReview")}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-2xl text-sm pressable"
          >
            {t("release.backHome")}
          </button>
        </div>
      </div>
    );
  }

  if (done === "issue") {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <TopBar title={t("release.issuedTitle")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6 scale-in">
            <AlertTriangle size={44} className="text-amber-500" />
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900 mb-2">{t("release.issuedTitle")}</h2>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-6 max-w-xs">
            {t("release.issuedSub")}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl text-[15px] pressable"
          >
            {t("release.backHome")}
          </button>
        </div>
      </div>
    );
  }

  // Issue form view
  if (showIssueForm) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <TopBar title={t("release.issueFormTitle")} back />
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          <p className="text-[12px] text-gray-500 leading-relaxed">
            {t("release.issueNote")}
          </p>

          {/* Issue checkboxes */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {ISSUE_OPTIONS.map(({ key, labelKey }, i) => (
              <button
                key={key}
                onClick={() => toggleIssue(key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition pressable ${
                  i < ISSUE_OPTIONS.length - 1 ? "border-b border-gray-50" : ""
                } ${selectedIssues.includes(key) ? "bg-red-50" : "bg-white"}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedIssues.includes(key)
                    ? "bg-red-500 border-red-500"
                    : "border-gray-300"
                }`}>
                  {selectedIssues.includes(key) && <CheckCircle size={12} className="text-white" fill="white" strokeWidth={0} />}
                </div>
                <span className={`text-[13px] font-medium ${selectedIssues.includes(key) ? "text-red-700" : "text-gray-700"}`}>
                  {t(labelKey)}
                </span>
              </button>
            ))}
          </div>

          {/* Free-text details */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">{t("release.issueDetails")}</p>
            <textarea
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              placeholder={t("release.issueDetailsPlaceholder")}
              rows={4}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-400 resize-none"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            />
          </div>

          <div className="flex flex-col gap-2 pb-4">
            <button
              onClick={handleIssueSubmit}
              disabled={selectedIssues.length === 0}
              className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl text-[14px] pressable disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <AlertTriangle size={16} />
              {t("release.submitIssue")}
            </button>
            <button
              onClick={() => setShowIssueForm(false)}
              className="w-full bg-white border border-gray-200 text-gray-500 font-semibold py-3.5 rounded-2xl text-sm pressable"
            >
              {t("release.cancelIssue")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <TopBar title={t("release.title")} back />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Contractor note */}
        {contractor && (
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={contractor.avatarUrl} name={contractor.name} size="md" />
              <div>
                <p className="font-bold text-gray-900 text-[14px]">{contractor.businessName}</p>
                <p className="text-emerald-600 text-[11px] font-semibold">{t("release.workComplete")}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[12px] text-gray-600 leading-relaxed italic">
                "{project.completionNote ?? "All work has been completed as per the agreement. Please review and approve when ready."}"
              </p>
            </div>
          </div>
        )}

        {/* Before/After photo comparison — Gap 4 */}
        {beforePhoto && afterPhoto && (
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">{t("release.compareTitle")}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <img src={beforePhoto} alt="Before" className="w-full h-36 object-cover rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 rounded-b-xl py-1.5 text-center">
                  <span className="text-white text-[11px] font-bold uppercase tracking-wide">{t("release.beforeLabel")}</span>
                </div>
              </div>
              <div className="relative">
                <img src={afterPhoto} alt="After" className="w-full h-36 object-cover rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 bg-emerald-700/70 rounded-b-xl py-1.5 text-center">
                  <span className="text-white text-[11px] font-bold uppercase tracking-wide">{t("release.afterLabel")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion photos (full gallery with nav) */}
        {allCompletionPhotos.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">{t("release.completionPhotos")}</p>
            {allCompletionPhotos.length === 1 ? (
              <img src={allCompletionPhotos[0]} alt="Completion" className="w-full h-44 object-cover rounded-xl" />
            ) : (
              <div className="relative">
                <img
                  src={allCompletionPhotos[photoIndex]}
                  alt={`Completion ${photoIndex + 1}`}
                  className="w-full h-44 object-cover rounded-xl"
                />
                <button
                  onClick={() => setPhotoIndex((i) => Math.max(0, i - 1))}
                  disabled={photoIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center pressable disabled:opacity-20"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <button
                  onClick={() => setPhotoIndex((i) => Math.min(allCompletionPhotos.length - 1, i + 1))}
                  disabled={photoIndex === allCompletionPhotos.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center pressable disabled:opacity-20"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {allCompletionPhotos.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition ${i === photoIndex ? "bg-white" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Escrow summary */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-teal-600" />
            <span className="font-bold text-teal-800 text-sm">{t("release.escrowSummary")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-teal-700">{t("release.heldInEscrow")}</span>
            <span className="text-[16px] font-extrabold text-teal-800">
              {formatCurrency(project.escrowAmount ?? 0)}
            </span>
          </div>
          <p className="text-[11px] text-teal-600 mt-1.5 leading-relaxed">
            {t("release.releaseNote")} {contractor?.businessName ?? "the contractor"}.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pb-4">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl text-[15px] pressable disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              t("release.releasing")
            ) : (
              <>
                <CheckCircle size={18} />
                {t("release.approveBtn")} {formatCurrency(project.escrowAmount ?? 0)}
              </>
            )}
          </button>
          {/* Gap 5: Guided issue form instead of direct raiseIssue call */}
          <button
            onClick={() => setShowIssueForm(true)}
            className="w-full bg-white border border-red-200 text-red-500 font-semibold py-3.5 rounded-2xl text-sm pressable flex items-center justify-center gap-2"
          >
            <AlertTriangle size={15} />
            {t("release.issueBtn")}
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed pb-2">
          {t("release.issueNote")}
        </p>
      </div>
    </div>
  );
}
