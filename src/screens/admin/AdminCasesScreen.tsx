import { Scale, Clock, Shield, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/layout/TopBar";
import { formatCurrency } from "../../utils/formatters";

type CaseResolution = "released" | "refunded" | "split" | null;

export default function AdminCasesScreen() {
  const [expandedCase, setExpandedCase] = useState<string | null>("case-001");
  const [resolutions, setResolutions] = useState<Record<string, CaseResolution>>({});
  const { t } = useApp();

  const CASES = [
    {
      id: "case-001",
      projectTitle: t("case1.title"),
      customer: t("case1.customer"),
      contractor: t("case1.contractor"),
      amount: 3200,
      status: "open",
      daysOpen: 15,
      description: t("case1.description"),
      evidence: [t("case1.evidence1"), t("case1.evidence2")],
      resolution: null as string | null,
    },
    {
      id: "case-002",
      projectTitle: t("case2.title"),
      customer: t("case2.customer"),
      contractor: t("case2.contractor"),
      amount: 1850,
      status: "pending_resolution",
      daysOpen: 7,
      description: t("case2.description"),
      evidence: [t("case2.evidence1"), t("case2.evidence2"), t("case2.evidence3")],
      resolution: t("case2.resolution"),
    },
  ];

  const handleAction = (caseId: string, action: CaseResolution) => {
    setResolutions((prev) => ({ ...prev, [caseId]: action }));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <TopBar title={t("admin.cases.title")} back />

      {/* Summary */}
      <div className="flex gap-3 px-4 py-3">
        <div className="flex-1 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center">
          <p className="text-[18px] font-extrabold text-red-600">1</p>
          <p className="text-[10px] text-red-500 font-medium">{t("admin.cases.open")}</p>
        </div>
        <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-center">
          <p className="text-[18px] font-extrabold text-amber-600">1</p>
          <p className="text-[10px] text-amber-500 font-medium">{t("admin.cases.pending")}</p>
        </div>
        <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-center">
          <p className="text-[18px] font-extrabold text-emerald-600">12</p>
          <p className="text-[10px] text-emerald-500 font-medium">{t("admin.cases.resolved")}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {CASES.map((c) => {
          const isExpanded = expandedCase === c.id;
          const resolution = resolutions[c.id];

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              {/* Header */}
              <button
                className="w-full px-4 py-4 text-left pressable"
                onClick={() => setExpandedCase(isExpanded ? null : c.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          resolution
                            ? "bg-emerald-100 text-emerald-600"
                            : c.status === "open"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {resolution
                          ? t("admin.cases.resolved")
                          : c.status === "open"
                          ? t("admin.cases.open")
                          : t("admin.cases.pendingResolution")}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={10} />
                        <span className="text-[10px]">{c.daysOpen} {t("admin.cases.days")}</span>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-[14px]">{c.projectTitle}</p>
                    <p className="text-gray-400 text-[11px]">
                      {c.customer} vs {c.contractor}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[15px] font-extrabold text-gray-800">
                      {formatCurrency(c.amount)}
                    </p>
                    <div className="flex items-center gap-1 text-teal-600">
                      <Shield size={11} />
                      <span className="text-[10px] font-semibold">{t("admin.cases.inHold")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                    {t("admin.cases.summary")}
                  </p>
                  <p className="text-[12px] text-gray-600 leading-relaxed mb-4">{c.description}</p>

                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                    {t("admin.cases.evidence")}
                  </p>
                  <div className="flex flex-col gap-1.5 mb-4">
                    {c.evidence.map((ev) => (
                      <div
                        key={ev}
                        className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2"
                      >
                        <CheckCircle size={12} className="text-teal-500" />
                        <span className="text-[12px] text-gray-600">{ev}</span>
                      </div>
                    ))}
                  </div>

                  {c.resolution && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                      <p className="text-[11px] font-bold text-amber-700 mb-1">{t("admin.cases.adminNote")}</p>
                      <p className="text-[12px] text-amber-600 leading-relaxed">{c.resolution}</p>
                    </div>
                  )}

                  {/* Resolution success state */}
                  {resolution ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-800 text-[13px]">
                          {resolution === "released" && t("admin.cases.release")}
                          {resolution === "refunded" && t("admin.cases.refund")}
                          {resolution === "split" && t("admin.cases.split")}
                        </p>
                        <p className="text-emerald-600 text-[11px] mt-0.5">
                          {t("admin.cases.resolved")} — {formatCurrency(c.amount)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Admin actions */
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(c.id, "released")}
                        className="flex-1 bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-[12px] pressable"
                      >
                        {t("admin.cases.release")}
                      </button>
                      <button
                        onClick={() => handleAction(c.id, "refunded")}
                        className="flex-1 bg-red-50 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl text-[12px] pressable"
                      >
                        {t("admin.cases.refund")}
                      </button>
                      <button
                        onClick={() => handleAction(c.id, "split")}
                        className="flex-1 bg-amber-50 border border-amber-200 text-amber-600 font-semibold py-2.5 rounded-xl text-[12px] pressable"
                      >
                        {t("admin.cases.split")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
