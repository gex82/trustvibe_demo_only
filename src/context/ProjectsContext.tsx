import { createContext, useContext, useState, type ReactNode } from "react";
import type { Project, Quote } from "../types";
import { INITIAL_PROJECTS } from "../data/projects";

interface ProjectsContextType {
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  acceptQuote: (projectId: string, quoteId: string) => void;
  fundEscrow: (projectId: string) => void;
  requestCompletion: (projectId: string) => void;
  approveRelease: (projectId: string) => void;
  raiseIssue: (projectId: string) => void;
  submitQuote: (projectId: string, quote: Omit<Quote, "id" | "submittedAt">) => void;
  addProject: (project: Omit<Project, "id" | "createdAt" | "quotes" | "status">) => string;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
  };

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const acceptQuote = (projectId: string, quoteId: string) => {
    const project = getProject(projectId);
    if (!project) return;
    const quote = project.quotes.find((q) => q.id === quoteId);
    if (!quote) return;
    const fee = Math.min(Math.round(quote.amount * 0.07), 300);
    updateProject(projectId, {
      acceptedQuoteId: quoteId,
      escrowAmount: quote.amount,
      trustvibeFee: fee,
      status: "funded",
      quotes: project.quotes.map((q) => ({
        ...q,
        status: q.id === quoteId ? "accepted" : "rejected",
      })),
    });
  };

  const fundEscrow = (projectId: string) => {
    updateProject(projectId, { status: "in_progress" });
  };

  const requestCompletion = (projectId: string) => {
    updateProject(projectId, { status: "complete_requested" });
  };

  const approveRelease = (projectId: string) => {
    updateProject(projectId, { status: "completed" });
  };

  const raiseIssue = (projectId: string) => {
    updateProject(projectId, { status: "disputed" });
  };

  const submitQuote = (
    projectId: string,
    quoteData: Omit<Quote, "id" | "submittedAt">
  ) => {
    const newQuote: Quote = {
      ...quoteData,
      id: `quote-new-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, quotes: [...p.quotes, newQuote] } : p
      )
    );
  };

  const addProject = (projectData: Omit<Project, "id" | "createdAt" | "quotes" | "status">): string => {
    const newId = `proj-new-${Date.now()}`;
    const newProject: Project = {
      ...projectData,
      id: newId,
      status: "open",
      quotes: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setProjects((prev) => [newProject, ...prev]);
    return newId;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        getProject,
        acceptQuote,
        fundEscrow,
        requestCompletion,
        approveRelease,
        raiseIssue,
        submitQuote,
        addProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be inside ProjectsProvider");
  return ctx;
}
