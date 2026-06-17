import React, { useState } from 'react';
import { Project, RecordItem } from '../types';
import { createNewProject, calculateEmbeddingIndex } from '../utils';
import { FolderKanban, Plus, Layers, Milestone, Compass, X, Trash2, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onRefreshProjects: () => void;
}

export default function Dashboard({ projects, onSelectProject, onRefreshProjects }: DashboardProps) {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [mainCulturalContext, setMainCulturalContext] = useState('Cultura Nordestina');
  const [error, setError] = useState('');

  // Calculations for platform-wide statistics
  const totalProjects = projects.length;
  
  const allRecords = projects.flatMap(p => p.records || []);
  const totalReferences = allRecords.filter(r => r.type === 'referencia').length;
  const totalArtifacts = allRecords.length;

  const averageIndex = totalProjects > 0
    ? Math.round(
        projects.reduce((acc, p) => acc + calculateEmbeddingIndex(p).score, 0) / totalProjects
      )
    : 0;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !objective.trim()) {
      setError('Por favor, defina o nome e o objetivo do seu projeto.');
      return;
    }

    try {
      const newProj = createNewProject(name.trim(), objective.trim(), mainCulturalContext);
      setName('');
      setObjective('');
      setMainCulturalContext('Cultura Nordestina');
      setError('');
      setShowNewProjectForm(false);
      onRefreshProjects();
      onSelectProject(newProj); // immediately open new project workspace!
    } catch (err) {
      setError('Falha ao registrar novo catálogo no LocalStorage.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Narrative Header Banner */}
      <div className="bg-white border border-raiz-border p-6 md:p-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-raiz-terracotta"></div>
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-raiz-terracotta font-semibold block">
            GABINETE DE PRESERVAÇÃO INTEGRADA
          </span>
          <h2 className="font-serif italic text-3xl text-raiz-dark font-semibold tracking-tight">
            Seu Portfólio de Salvaguarda Cultural
          </h2>
          <p className="text-xs text-raiz-gray leading-relaxed text-justify">
            Aqui estão salvos seus arquivos vivos de design de futuros. Cada dossiê mapeia conexões ancestrais para resgatar marcas, produtos e narrativas utilitárias das garras da homogeneização mecânica promovida pelo Grande Vazio Digital.
          </p>
        </div>
      </div>

      {/* Global Dashboard Statistics Banner (Archival Shelf Aesthetics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Total Dossiers */}
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px]">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            DOSSIÊS ATIVOS // RZ-P0
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-raiz-dark">
              {totalProjects}
            </span>
            <Layers className="w-5 h-5 text-raiz-green stroke-1" />
          </div>
          <p className="text-[10px] text-raiz-gray font-mono mt-1">
            Projetos cadastrados em nuvem do navegador
          </p>
        </div>

        {/* Stat 2: Average Embedding Index */}
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px]">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            ÍNDICE MÉDIO // RAIG-M
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-raiz-terracotta">
              {averageIndex}%
            </span>
            <Milestone className="w-5 h-5 text-raiz-terracotta stroke-1" />
          </div>
          <p className="text-[10px] text-raiz-gray font-mono mt-1">
            Nível geral médio de contextualização
          </p>
        </div>

        {/* Stat 3: Total References logged */}
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px]">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            REPOSTÓRIO DE REFERÊNCIAS // REF-TOT
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-raiz-dark">
              {totalReferences}
            </span>
            <Compass className="w-5 h-5 text-raiz-green stroke-1" />
          </div>
          <p className="text-[10px] text-raiz-gray font-mono mt-1">
            Tradições, folclores e símbolos catalogados
          </p>
        </div>

        {/* Stat 4: Preserved fragments overall */}
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px]">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            FRAGMENTOS DE CONTEXTO // FRAG-PRE
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-raiz-dark">
              {totalArtifacts}
            </span>
            <FolderKanban className="w-5 h-5 text-raiz-gray stroke-1" />
          </div>
          <p className="text-[10px] text-raiz-gray font-mono mt-1">
            Soma de referências, memórias, decisões e críticas
          </p>
        </div>
      </div>

      {/* Main Grid: Projects Listing vs Project Creation form toggler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left/Middle Block - Projects Inventory Case (takes 2 cols if form is side-by-side or simple layout) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif italic text-lg text-raiz-dark">
              Prateleira de Arquivos Vivos
            </h3>
            
            {!showNewProjectForm && (
              <button
                id="btn-new-project-toggle"
                onClick={() => setShowNewProjectForm(true)}
                className="flex items-center gap-1.5 bg-raiz-green hover:bg-raiz-green/90 text-white font-sans uppercase font-medium tracking-wider text-[10px] px-3.5 py-2 transition-colors cursor-pointer select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Projeto
              </button>
            )}
          </div>

          {totalProjects === 0 ? (
            <div className="bg-white border border-dashed border-raiz-border p-12 text-center rounded-none">
              <Layers className="w-10 h-10 text-raiz-gray/40 mx-auto mb-4 stroke-1 animate-pulse" />
              <p className="font-serif italic text-base text-raiz-dark">A sua prateleira está vazia</p>
              <p className="text-xs text-raiz-gray mt-2 max-w-sm mx-auto">
                Crie seu primeiro dossiê de salvaguarda preenchendo o formulário ao lado para iniciar sua jornada contra a aculturação estética.
              </p>
              <button
                onClick={() => setShowNewProjectForm(true)}
                className="mt-6 inline-flex items-center gap-1.5 bg-raiz-terracotta hover:bg-raiz-terracotta/90 text-white font-sans uppercase font-medium tracking-wider text-[10px] px-4 py-2.5 transition-colors cursor-pointer select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                Criar Primeiro Dossiê
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const indexDetails = calculateEmbeddingIndex(proj);
                const itemsCount = proj.records?.length || 0;

                return (
                  <div
                    key={proj.id}
                    className="bg-white border border-raiz-border hover:border-raiz-green p-6 relative flex flex-col justify-between group transition-all duration-300"
                  >
                    {/* Tiny visual ribbon showing context color based on selection */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-raiz-border group-hover:bg-raiz-green transition-colors"></div>
                    <div className="absolute -top-3.5 right-4 bg-raiz-bg px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest text-raiz-gray border border-raiz-border">
                      CÓD-P{proj.id.slice(-3).toUpperCase()}
                    </div>

                    <div className="space-y-3">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-raiz-terracotta font-semibold">
                        {proj.mainCulturalContext}
                      </span>
                      
                      <h4 className="font-serif italic text-lg leading-snug font-semibold text-raiz-dark group-hover:text-raiz-green transition-colors">
                        {proj.name}
                      </h4>

                      <p className="text-xs text-raiz-gray line-clamp-3 leading-relaxed">
                        {proj.objective}
                      </p>
                    </div>

                    {/* Progress score bar inside card */}
                    <div className="mt-6 pt-4 border-t border-raiz-border space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-raiz-gray uppercase">Enraizamento:</span>
                        <span className="text-raiz-dark font-bold font-serif italic text-xs">
                          {indexDetails.score}%
                        </span>
                      </div>
                      <div className="w-full bg-raiz-bg h-1 rounded-none overflow-hidden/20">
                        <div
                          className="bg-raiz-green h-full transition-all duration-300"
                          style={{ width: `${indexDetails.score}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] font-mono text-raiz-gray pt-1">
                        <span>{itemsCount} fragmento(s)</span>
                        <span className="uppercase tracking-tight text-[8px]">
                          {indexDetails.level.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Active access action row */}
                    <button
                      onClick={() => onSelectProject(proj)}
                      className="mt-5 w-full bg-raiz-bg hover:bg-raiz-green hover:text-white border border-raiz-border group-hover:border-raiz-green py-2.5 px-3 flex items-center justify-between text-[11px] font-mono tracking-wider uppercase transition-all cursor-pointer group-hover:shadow-xs"
                    >
                      <span>Abrir Arquivo Vivo</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-raiz-terracotta group-hover:text-white transition-colors" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Block - Project Creation Form Panel */}
        {showNewProjectForm && (
          <div className="bg-white border border-raiz-border p-6 rounded-none space-y-6 animate-fade-in lg:sticky lg:top-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif italic text-lg text-raiz-dark">
                Novo Registro de Gênese
              </h3>
              <button
                onClick={() => setShowNewProjectForm(false)}
                className="text-raiz-gray hover:text-raiz-dark p-1 cursor-pointer"
                title="Fechar Formulário"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-raiz-gray leading-relaxed">
              Inicie um dossiê em branco delimitando o escopo estético e do território cultural que fundamentará a concepção das decisões de design.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-500 text-xs font-medium rounded-none">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="p-name" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                  Nome do Projeto (Manifestação)
                </label>
                <input
                  id="p-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Ex. LUME - Luminária Cabocla"
                  className="w-full bg-raiz-bg border border-raiz-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                />
              </div>

              {/* Cultural Context options mapping */}
              <div>
                <label htmlFor="p-context" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                  Contexto Cultural Principal
                </label>
                <select
                  id="p-context"
                  value={mainCulturalContext}
                  onChange={(e) => setMainCulturalContext(e.target.value)}
                  className="w-full bg-raiz-bg border border-raiz-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark font-sans"
                >
                  <option value="Cultura Nordestina">Cultura Nordestina</option>
                  <option value="Cultura Amazônica">Cultura Amazônica</option>
                  <option value="Cultura Urbana Brasileira">Cultura Urbana / Periférica</option>
                  <option value="Cultura Popular Tradicional">Cultura Popular Brasileira (Maracatu, Cordel, Frevo)</option>
                  <option value="Cultura Indígena e Originária">Cultura de Matriz Indígena</option>
                  <option value="Cultura Afro-Brasileira">Cultura de Matriz Afro-Brasileira</option>
                  <option value="Cultura Digital Integrada">Cultura de Resistência Digital</option>
                </select>
              </div>

              {/* Objective */}
              <div>
                <label htmlFor="p-objective" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                  Objetivo e Manifesto do Projeto
                </label>
                <textarea
                  id="p-objective"
                  rows={4}
                  value={objective}
                  onChange={(e) => {
                    setObjective(e.target.value);
                    setError('');
                  }}
                  placeholder="Ex. Desenvolver uma luminária tátil que resgata a iluminação acolhedora dos lampiões sertanejos, contra a esterilidade de tons frios nórdicos promovidos por algoritmos."
                  className="w-full bg-raiz-bg border border-raiz-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectForm(false)}
                  className="w-1/3 border border-raiz-border hover:bg-raiz-bg text-raiz-gray font-sans uppercase font-medium tracking-wider text-[10px] py-3.5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-create-project-submit"
                  type="submit"
                  className="w-2/3 bg-raiz-green hover:bg-raiz-green/90 text-white font-sans uppercase font-medium tracking-wider text-[10px] py-3.5 transition-colors cursor-pointer"
                >
                  Registrar Gênese
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
