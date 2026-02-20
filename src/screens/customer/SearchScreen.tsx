import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, MapPin, CheckCircle, ChevronRight, Zap, SlidersHorizontal, X } from "lucide-react";
import { getContractors } from "../../data/users";
import { useApp } from "../../context/AppContext";
import type { Contractor } from "../../types";
import TopBar from "../../components/layout/TopBar";
import Avatar from "../../components/ui/Avatar";
import Card from "../../components/ui/Card";

export default function SearchScreen() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMunicipality, setActiveMunicipality] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const CATEGORIES = [
    { key: "all", label: t("category.all") },
    { key: "plumbing", label: t("category.plumbing") },
    { key: "electrical", label: t("category.electrical") },
    { key: "painting", label: t("category.painting") },
    { key: "hvac", label: t("category.hvac") },
    { key: "carpentry", label: t("category.carpentry") },
    { key: "tiling", label: t("category.tiling") },
  ];

  const MUNICIPALITIES = [
    { key: "all", label: t("search.filterAll") },
    { key: "San Juan", label: t("search.filterSanJuan") },
    { key: "Bayamón", label: t("search.filterBayamon") },
    { key: "Caguas", label: t("search.filterCaguas") },
    { key: "Ponce", label: t("search.filterPonce") },
    { key: "Carolina", label: t("search.filterCarolina") },
  ];

  const RATINGS = [
    { key: 0, label: t("category.all") },
    { key: 4, label: t("search.rating4plus") },
    { key: 4.5, label: t("search.rating45plus") },
  ];

  const contractors = getContractors();

  const filtered = contractors.filter((c) => {
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.businessName.toLowerCase().includes(query.toLowerCase()) ||
      c.specialty.some((s) => s.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      activeCategory === "all" ||
      c.specialty.some((s) =>
        s.toLowerCase().includes(activeCategory.toLowerCase())
      );

    const matchesMunicipality =
      activeMunicipality === "all" ||
      (c.location ?? "").toLowerCase().includes(activeMunicipality.toLowerCase());

    const matchesRating = c.rating >= minRating;

    return matchesQuery && matchesCategory && matchesMunicipality && matchesRating;
  });

  const activeFilterCount =
    (activeMunicipality !== "all" ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const clearFilters = () => {
    setActiveMunicipality("all");
    setMinRating(0);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <TopBar title={t("search.title")} />

      {/* Search bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition pressable ${
              activeFilterCount > 0
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 ? (
              <span>{activeFilterCount} {activeFilterCount === 1 ? t("search.filtersActive") : t("search.filtersActivePlural")}</span>
            ) : (
              <span>{t("search.filterLabel")}</span>
            )}
          </button>
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
            {/* Municipality filter */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">{t("search.filterMunicipality")}</p>
              <div className="flex gap-1.5 flex-wrap">
                {MUNICIPALITIES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setActiveMunicipality(m.key)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition pressable ${
                      activeMunicipality === m.key
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">{t("search.filterRating")}</p>
              <div className="flex gap-1.5">
                {RATINGS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setMinRating(r.key)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition pressable ${
                      minRating === r.key
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {r.key > 0 && <Star size={10} fill="currentColor" />}
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[11px] text-red-500 font-semibold self-start pressable"
              >
                <X size={12} />
                {t("search.clearFilters")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none bg-white border-b border-gray-100">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition pressable ${
              activeCategory === cat.key
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search size={32} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">{t("search.noResults")}</p>
            <p className="text-gray-400 text-sm mt-1">{t("search.noResultsSub")}</p>
          </div>
        ) : (
          filtered.map((c) => <ContractorCard key={c.id} contractor={c} onPress={() => navigate(`/contractor/${c.id}`)} />)
        )}
      </div>
    </div>
  );
}

function ContractorCard({ contractor: c, onPress }: { contractor: Contractor; onPress: () => void }) {
  const { t } = useApp();
  return (
    <Card onClick={onPress} padding="none" shadow="sm">
      <div className="p-4 flex gap-3">
        <div className="relative flex-shrink-0">
          <Avatar src={c.avatarUrl} name={c.name} size="lg" />
          {c.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle size={11} className="text-white" fill="white" strokeWidth={0} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-[14px] truncate">{c.businessName}</h3>
              <p className="text-gray-500 text-[11px]">{c.name}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 flex-shrink-0 ml-2" />
          </div>

          {/* Rating & stats */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400" fill="#fbbf24" />
              <span className="text-[12px] font-bold text-gray-800">{c.rating}</span>
              <span className="text-[11px] text-gray-400">({c.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin size={11} />
              <span className="text-[11px]">{c.location}</span>
            </div>
          </div>

          {/* Specialty tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {c.specialty.slice(0, 3).map((s) => (
              <span key={s} className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
          </div>

          {/* Response time & jobs */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-teal-600">
              <Zap size={11} />
              <span className="text-[10px] font-semibold">{c.responseTime}</span>
            </div>
            <span className="text-[10px] text-gray-400">{c.completedJobs} {t("search.jobsCompleted")}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      {c.badges.length > 0 && (
        <div className="px-4 pb-3 flex gap-1.5 flex-wrap border-t border-gray-50 pt-2.5">
          {c.badges.map((b) => (
            <span key={b} className="text-[10px] text-teal-700 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5 font-semibold">
              {b}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
