import React, { useState, useEffect } from 'react';
import { UserSession, Project } from './types';
import { getStoredUser, clearUserSession, getStoredProjects, deleteProject } from './utils';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectWorkspace from './components/ProjectWorkspace';
import { LogOut, Globe, HeartHandshake, ShieldAlert, Cpu } from 'lucide-react';

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
    return (
      <div className="bg-raiz-bg min-h-screen SelectionColor py-6">
        <main className="container mx-auto max-w-6xl">
          <Login onLoginSuccess={handleLoginSuccess} />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-raiz-bg min-h-screen flex flex-col justify-between selection:bg-raiz-terracotta/20 selection:text-raiz-dark">
      {/* Platform Header - Hidden in Print media */}
      <header className="bg-white border-b border-raiz-border px-6 py-4 md:py-5 no-print sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Manifesto subtitle */}
          <div className="flex items-center gap-3">
            <div 
              className="font-serif italic text-2xl font-bold text-raiz-green tracking-tight select-none cursor-pointer"
              onClick={() => setSelectedProject(null)}
              title="Voltar ao Painel Geral"
            >
              RAIZ
            </div>
            
            <div className="h-4 w-[1px] bg-raiz-border hidden sm:block"></div>
            
            <div className="hidden sm:block text-[10px] uppercase font-mono tracking-wider text-raiz-gray">
              Pesquisa, Memória e Arquivo Vivo
            </div>
          </div>

          {/* User Session & Sign Out details */}
          <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 md:gap-5">
            <div className="text-left md:text-right font-mono text-[10px] leading-tight shrink-0">
              <span className="text-raiz-gray uppercase block">Designer Ativo</span>
              <span className="text-raiz-dark/95 font-medium">
                {session.name} <span className="text-raiz-terracotta">({session.email.split('@')[0]})</span>
              </span>
            </div>

            <div className="h-4 w-[1px] bg-raiz-border"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-raiz-bg hover:bg-raiz-border/50 border border-raiz-border px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-raiz-gray hover:text-raiz-dark transition-all cursor-pointer select-none rounded-none"
              title="Sair da plataforma"
            >
              <LogOut className="w-3.5 h-3.5" />
              Encerrar
            </button>
          </div>

        </div>

        {/* Minimal aesthetic ticker detailing Design Futures context */}
        <div className="container mx-auto max-w-6xl mt-3 md:mt-4 pt-2 border-t border-raiz-bg/85 flex flex-wrap items-center justify-between text-[9px] font-mono text-raiz-gray">
          <div className="flex items-center gap-1.5 shrink-0">
            <Cpu className="w-3 h-3 text-raiz-terracotta" />
            <span>ARQUIVO ANTI-VAZIO DIGITAL // RESISTÊNCIA COGNITIVA</span>
          </div>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <span>SISTEMA ATIVO: 100% REGIONALIDADE</span>
            <span>CORDEL // TAPAJÓS // URBANO</span>
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
