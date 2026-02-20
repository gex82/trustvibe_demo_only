import { useState } from "react";
import { Search, ChevronRight, Shield, MapPin } from "lucide-react";
import { useProjects } from "../../context/ProjectsContext";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/layout/TopBar";
import Badge from "../../components/ui/Badge";
import { formatCurrency } from "../../utils/formatters";

export default function AdminProjectsScreen() {
  const { projects } = useProjects();
  const { t } = useApp();
  const [query, setQuery] = useState("");

  const allProjects = projects;
  const filtered = !query
    ? allProjects
    : allProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <TopBar title={t("admin.projects.title")} back />

      {/* Search */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.projects.placeholder")}
            className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Count */}
      <div className="px-4 py-2 bg-white border-b border-gray-50">
        <p className="text-[11px] text-gray-400">{filtered.length} {t("admin.projects.count")}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i < filtered.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                {project.photos[0] ? (
                  <img
                    src={project.photos[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Shield size={18} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-[13px] truncate">
                  {project.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5 text-gray-400">
                    <MapPin size={10} />
                    <span className="text-[10px]">{project.location}</span>
                  </div>
                  {project.escrowAmount && (
                    <span className="text-[10px] font-bold text-teal-600">
                      {formatCurrency(project.escrowAmount)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge status={project.status} size="xs" />
                <ChevronRight size={13} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
