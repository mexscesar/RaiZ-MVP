import React, { useState, useEffect } from 'react';
import { UserSession, Project } from './types';
import { getStoredUser, clearUserSession, getStoredProjects, deleteProject } from './utils';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectWorkspace from './components/ProjectWorkspace';
import { LogOut, Globe, HeartHandshake, ShieldAlert, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load state on mount
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setSession(user);
    }
    const storedProjects = getStoredProjects();
    setProjects(storedProjects);
  }, []);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    // Load projects for user
    const stored = getStoredProjects();
    setProjects(stored);
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente encerrar a sessão? Seus dados continuarão salvos localmente neste navegador.')) {
      clearUserSession();
      setSession(null);
      setSelectedProject(null);
    }
  };

  const refreshProjectsList = () => {
    const stored = getStoredProjects();
    setProjects(stored);
  };

  const handleUpdateProject = (updatedProj: Project) => {
    // Save to projects state
    const nextProjects = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(nextProjects);
    setSelectedProject(updatedProj);
  };

  const handleDeleteProject = (projectId: string) => {
    const remaining = deleteProject(projectId);
    setProjects(remaining);
    setSelectedProject(null);
  };

  // If session is empty, show login panel immediately
  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-raiz-bg min-h-screen flex flex-col justify-between selection:bg-raiz-terracotta/20 selection:text-raiz-dark">
      {/* Platform Header - Floating modern capsule in green tones */}
      <header className="mx-auto w-full max-w-6xl mt-6 px-4 md:px-6 no-print sticky top-4 z-40">
        <div className="bg-gradient-to-r from-[#062014] via-[#0E3523] to-[#144830] border border-white/10 rounded-2xl px-6 py-4 shadow-xl shadow-emerald-950/20 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Workspace Capsule Indicator */}
          <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
            <div 
              className="font-serif italic text-2xl font-black text-white tracking-tight select-none cursor-pointer flex items-center gap-2.5 hover:opacity-90 active:scale-95 transition-all"
              onClick={() => setSelectedProject(null)}
              title="Voltar ao Painel Geral"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-green-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4.5 h-4.5 text-[#061C12]" />
              </div>
              <span>RAIZ</span>
            </div>
            
            {/* Capsule Pill similar to mockup's "Workspace Ativo • Modo Autónomo" */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 select-none animate-pulse"></span>
              <span className="font-semibold">WORKSPACE ATIVO &bull; MODO AUTÔNOMO</span>
            </div>
          </div>

          {/* User Session info, Avatar circle & Logout button */}
          <div className="flex items-center justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/10 md:border-t-0">
            
            {/* User credentials */}
            <div className="text-right font-sans leading-tight hidden sm:block">
              <span className="text-white font-semibold text-xs block">{session.name}</span>
              <span className="text-emerald-300/70 text-[10px] font-mono tracking-tight">{session.email}</span>
            </div>

            {/* Initials Avatar Bubble */}
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-950 border border-white/20 flex items-center justify-center font-mono text-xs font-bold text-white select-none shadow-inner"
              title={`${session.name} (${session.email})`}
            >
              {getInitials(session.name)}
            </div>

            <div className="h-5 w-[1px] bg-white/20 hidden sm:block"></div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 md:p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/10 rounded-xl text-white transition-all cursor-pointer flex items-center justify-center select-none active:scale-95"
              title="Sair da plataforma"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Workspace Frame */}
      <main className="container mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12 flex-1">
        {selectedProject ? (
          <ProjectWorkspace 
            project={selectedProject}
            userSessionName={session.name}
            onBackToDashboard={() => setSelectedProject(null)}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : (
          <Dashboard 
            projects={projects}
            onSelectProject={setSelectedProject}
            onRefreshProjects={refreshProjectsList}
          />
        )}
      </main>

      {/* Aesthetic Footer - Hidden in Print media */}
      <footer className="bg-white border-t border-raiz-border py-8 px-6 no-print">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-serif italic font-bold text-sm text-raiz-green">RAIZ</span>
              <span className="text-[10px] font-mono tracking-wider text-raiz-gray">// PRODUTOR DE CONFIANÇA ESTÉTICA CULTURAL</span>
            </div>
            <p className="text-[10px] text-raiz-gray leading-normal max-w-md">
              Mapeamento heurístico de repertório estético projetado para o cenário futuro &ldquo;O Grande Vazio Digital&rdquo;. Documentando o selo contextual das manifestações humanas.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-mono text-raiz-gray">
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-raiz-green" />
              <span>Brasília &bull; Território Livre</span>
            </div>
            <div className="h-3 w-[1px] bg-raiz-border hidden sm:block"></div>
            <div className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-raiz-terracotta" />
              <span>Cultura Autêntica Certificada</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl mt-6 pt-4 border-t border-raiz-bg text-center">
          <p className="text-[9px] text-raiz-gray/60 font-mono tracking-widest uppercase">
            &copy; 2026 RAIZ INC. &bull; PLATAFORMA SOLIDÁRIA DE PRESERVAÇÃO DE REFERÊNCIAS
          </p>
        </div>
      </footer>
    </div>
  );
}
