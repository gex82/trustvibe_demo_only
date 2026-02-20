import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Star, MapPin, CheckCircle, Zap, Shield, Award, MessageCircle, ChevronLeft, Info, X, CreditCard, FileCheck } from "lucide-react";
import { findUserById } from "../../data/users";
import { REVIEWS } from "../../data/reviews";
import type { Contractor } from "../../types";
import Avatar from "../../components/ui/Avatar";
import StarRating from "../../components/ui/StarRating";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/formatters";

// Determine deposit amount by specialty (business rule: $29–$79)
function getDepositAmount(specialty: string[]): number {
  if (specialty.some((s) => ["Electrical", "Solar Installation", "HVAC", "Plumbing"].includes(s))) return 79;
  if (specialty.some((s) => ["Tiling", "Carpentry"].includes(s))) return 49;
  return 29;
}

export default function ContractorProfileScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useApp();
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);

  const user = findUserById(id ?? "");
  if (!user || user.role !== "contractor") {
    return <div className="p-8 text-center text-gray-400">{t("profile.notFound")}</div>;
  }
  const c = user as Contractor;
  const reviews = REVIEWS.filter((r) => r.toUserId === c.id);
  const displayReviews = reviews.length > 0 ? reviews : REVIEWS;
  const depositAmount = getDepositAmount(c.specialty);
  const score = c.reliabilityScore ?? 95;

  // Simulated breakdown components from the score
  const breakdown = [
    { label: t("profile.reliabilityShowUp"), value: Math.min(100, score + 2) },
    { label: t("profile.reliabilityResponse"), value: Math.min(100, score - 1) },
    { label: t("profile.reliabilityDispute"), value: Math.min(100, score + 3) },
    { label: t("profile.reliabilityProof"), value: Math.min(100, score - 3) },
  ];

  const handleDepositConfirm = () => {
    setDepositPaid(true);
    setTimeout(() => {
      setShowDepositModal(false);
      navigate(`/messages?contractor=${c.id}`);
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Reliability score modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-t-3xl w-full max-w-sm p-5 pb-8" style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 text-[16px]">{t("profile.reliabilityTitle")}</h3>
              <button onClick={() => setShowScoreModal(false)} className="pressable">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              {breakdown.map(({ label, value }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-gray-600 font-medium">{label}</span>
                    <span className="text-[12px] font-extrabold text-teal-700">{value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">{t("profile.reliabilityInfo")}</p>
            <button
              onClick={() => setShowScoreModal(false)}
              className="w-full mt-4 bg-gray-100 text-gray-700 font-semibold py-3 rounded-2xl text-sm pressable"
            >
              {t("profile.close")}
            </button>
          </div>
        </div>
      )}

      {/* Estimate deposit modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-t-3xl w-full max-w-sm p-5 pb-8" style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.15)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-gray-900 text-[16px]">{t("deposit.title")}</h3>
              <button onClick={() => setShowDepositModal(false)} className="pressable">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <p className="text-[12px] text-gray-500 leading-relaxed mb-4">{t("deposit.subtitle")}</p>

            {/* Deposit amount */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-teal-700">{t("deposit.amount")}</span>
                <span className="text-[24px] font-extrabold text-teal-800">{formatCurrency(depositAmount)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-600">
                <Shield size={12} />
                <span className="text-[11px] font-medium">{t("deposit.refundNote")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-600 mt-1">
                <Shield size={12} />
                <span className="text-[11px] font-medium">{t("deposit.protectedNote")}</span>
              </div>
            </div>

            {/* Why a deposit */}
            <div className="mb-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">{t("deposit.whyTitle")}</p>
              {[t("deposit.why1"), t("deposit.why2"), t("deposit.why3")].map((why, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle size={13} className="text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-gray-600 leading-snug">{why}</span>
                </div>
              ))}
            </div>

            {/* Payment method */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-4">
              <CreditCard size={16} className="text-gray-400" />
              <span className="text-[12px] text-gray-600 font-medium">{t("deposit.cardLabel")}</span>
            </div>

            {depositPaid ? (
              <div className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl text-[15px] text-center">
                {t("deposit.paid")}
              </div>
            ) : (
              <>
                <button
                  onClick={handleDepositConfirm}
                  className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl text-[14px] pressable mb-2"
                >
                  {t("deposit.confirmBtn")} — {formatCurrency(depositAmount)}
                </button>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="w-full bg-white border border-gray-200 text-gray-500 font-semibold py-3 rounded-2xl text-sm pressable"
                >
                  {t("deposit.cancelBtn")}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cover header */}
      <div
        className="relative"
        style={{ background: "linear-gradient(160deg, #0f766e, #0d9488)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-4 z-10 flex items-center gap-1 text-white/80 text-sm font-medium pressable"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center pt-10 pb-6 px-5">
          <div className="relative">
            <Avatar src={c.avatarUrl} name={c.name} size="xl" className="ring-4 ring-white/30" />
            {c.verified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-300 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle size={15} className="text-teal-800" fill="#5eead4" strokeWidth={0} />
              </div>
            )}
          </div>
          <h1 className="text-white font-extrabold text-[20px] mt-3">{c.businessName}</h1>
          <p className="text-teal-100 text-sm">{c.name}</p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-amber-300" fill="#fcd34d" />
              <span className="text-white font-bold text-[15px]">{c.rating}</span>
              <span className="text-teal-200 text-xs">({c.reviewCount} {t("search.reviewsCount")})</span>
            </div>
            <div className="flex items-center gap-1 text-teal-200">
              <MapPin size={12} />
              <span className="text-xs">{c.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row — reliability score is now tappable */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex">
        <div className="flex-1 flex flex-col items-center">
          <span className="text-[16px] font-extrabold text-gray-900">{c.completedJobs}</span>
          <span className="text-[10px] text-gray-400 font-medium mt-0.5">{t("profile.jobs")}</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-[16px] font-extrabold text-gray-900">{c.responseTime}</span>
          <span className="text-[10px] text-gray-400 font-medium mt-0.5">{t("profile.response")}</span>
        </div>
        <button
          onClick={() => setShowScoreModal(true)}
          className="flex-1 flex flex-col items-center pressable"
        >
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-extrabold text-teal-600">{score}%</span>
            <Info size={12} className="text-teal-400" />
          </div>
          <span className="text-[10px] text-gray-400 font-medium mt-0.5">{t("profile.score")}</span>
        </button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 rounded-2xl text-sm pressable"
          >
            <MessageCircle size={16} />
            {t("btn.sendMessage")}
          </button>
          <button
            onClick={() => navigate(`/projects/new?contractor=${c.id}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl text-sm pressable"
          >
            <Shield size={16} className="text-teal-500" />
            {t("profile.hireViaEscrow")}
          </button>
        </div>

        {/* Credentials card — Gap 7 */}
        {(c.licenseNumber || c.insuranceVerified) && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <h2 className="text-[11px] font-bold text-blue-600 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
              <FileCheck size={13} />
              {t("profile.credentialsTitle")}
            </h2>
            <div className="flex flex-col gap-2">
              {c.licenseNumber && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-blue-500" />
                    <span className="text-[12px] font-semibold text-blue-800">{t("profile.licenseVerified")}</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-white border border-blue-200 px-2 py-0.5 rounded-lg">
                    {t("profile.license")}{c.licenseNumber}
                  </span>
                </div>
              )}
              {c.insuranceVerified && (
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-blue-500" />
                  <span className="text-[12px] font-semibold text-blue-800">{t("profile.insuranceVerified")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div>
          <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">
            {t("label.badges")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {c.badges.map((b) => (
              <div
                key={b}
                className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 rounded-xl px-3 py-1.5"
              >
                <Award size={12} className="text-teal-600" />
                <span className="text-teal-700 text-[11px] font-semibold">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response time */}
        <div className="bg-emerald-50 rounded-xl px-4 py-3 flex items-center gap-3">
          <Zap size={18} className="text-emerald-500" />
          <div>
            <p className="text-emerald-800 font-bold text-sm">{t("profile.typicalResponse")} {c.responseTime}</p>
            <p className="text-emerald-600 text-[11px]">
              {t("profile.respondsQuickly")}
            </p>
          </div>
        </div>

        {/* About */}
        <div>
          <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">
            {t("label.about")}
          </h2>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p className="text-gray-700 text-[13px] leading-relaxed">{c.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {c.specialty.map((s) => (
                <span key={s} className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">
            {t("label.portfolio")}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {c.portfolioImages.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Portfolio ${i + 1}`}
                className="w-full h-28 object-cover rounded-xl"
              />
            ))}
          </div>
        </div>

        {/* Reviews — Gap 3: show actual review cards */}
        <div>
          <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">
            {t("label.reviews")} ({displayReviews.length} {t("profile.reviewsCount")})
          </h2>
          <div className="flex flex-col gap-3">
            {displayReviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-bold text-gray-800 text-[13px]">{r.fromName}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{r.createdAt}</p>
                  </div>
                  <StarRating value={r.rating} size="sm" />
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {r.tags.map((tag) => (
                    <span key={tag} className="bg-teal-50 text-teal-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-teal-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-[12px] leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
