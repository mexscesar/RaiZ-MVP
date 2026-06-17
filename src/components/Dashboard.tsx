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
      <div className="bg-gradient-to-r from-emerald-50/40 to-green-50/10 border border-emerald-100 p-6 md:p-8 relative rounded-2xl shadow-xs overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-400"></div>
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-bold block">
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
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px] rounded-2xl shadow-xs hover:shadow-sm transition-all">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            DOSSIÊS ATIVOS // RZ-P0
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-[#111827]">
              {totalProjects}
            </span>
            <Layers className="w-5 h-5 text-emerald-600 stroke-[1.5]" />
          </div>
          <p className="text-[10px] text-raiz-gray font-mono mt-1">
            Projetos cadastrados em nuvem do navegador
          </p>
        </div>

        {/* Stat 2: Average Embedding Index */}
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px] rounded-2xl shadow-xs hover:shadow-sm transition-all">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            ÍNDICE MÉDIO // RAIG-M
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-emerald-700">
              {averageIndex}%
            </span>
            <Milestone className="w-5 h-5 text-emerald-600 stroke-[1.5]" />
          </div>
          <p className="text-[10px] text-raiz-gray font-mono mt-1">
            Nível geral médio de contextualização
          </p>
        </div>

        {/* Stat 3: Total References logged */}
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px] rounded-2xl shadow-xs hover:shadow-sm transition-all">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            REPOSTÓRIO DE REFERÊNCIAS // REF-TOT
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-[#111827]">
              {totalReferences}
            </span>
            <Compass className="w-5 h-5 text-emerald-600 stroke-[1.5]" />
          </div>
          <p className="text-[10px] text-raiz-gray font-mono mt-1">
            Tradições, folclores e símbolos catalogados
          </p>
        </div>

        {/* Stat 4: Preserved fragments overall */}
        <div className="bg-white border border-raiz-border p-5 relative flex flex-col justify-between min-h-[110px] rounded-2xl shadow-xs hover:shadow-sm transition-all">
          <div className="text-[9px] font-mono uppercase tracking-wider text-raiz-gray">
            FRAGMENTOS DE CONTEXTO // FRAG-PRE
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif italic text-4xl font-bold text-[#111827]">
              {totalArtifacts}
            </span>
            <FolderKanban className="w-5 h-5 text-raiz-gray stroke-[1.5]" />
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
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-700 text-white font-sans uppercase font-semibold tracking-wider text-[10px] px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer select-none"
              >
                <Plus className="w-4 h-4" />
                Novo Projeto
              </button>
            )}
          </div>

          {totalProjects === 0 ? (
            <div className="bg-white border border-dashed border-raiz-border p-12 text-center rounded-2xl shadow-xs">
              <Layers className="w-10 h-10 text-raiz-gray/40 mx-auto mb-4 stroke-1 animate-pulse" />
              <p className="font-serif italic text-base text-raiz-dark">A sua prateleira está vazia</p>
              <p className="text-xs text-raiz-gray mt-2 max-w-sm mx-auto">
                Crie seu primeiro dossiê de salvaguarda preenchendo o formulário ao lado para iniciar sua jornada contra a aculturação estética.
              </p>
              <button
                onClick={() => setShowNewProjectForm(true)}
                className="mt-6 inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-sans uppercase font-semibold tracking-wider text-[10px] px-5 py-3 rounded-xl transition-all cursor-pointer select-none shadow-sm"
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
                    className="bg-white border border-raiz-border hover:border-emerald-500 p-6 relative flex flex-col justify-between group rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    {/* Tiny visual ribbon showing context color based on selection */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E4E7EC] group-hover:bg-emerald-500 transition-colors"></div>
                    <div className="absolute -top-3.5 right-4 bg-[#F2F4F7] px-2.5 py-1 text-[8px] font-mono uppercase tracking-widest text-[#475467] border border-raiz-border rounded-full font-bold shadow-xs">
                      CÓD-P{proj.id.slice(-3).toUpperCase()}
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-raiz-terracotta font-bold">
                        {proj.mainCulturalContext}
                      </span>
                      
                      <h4 className="font-serif italic text-lg leading-snug font-bold text-raiz-dark group-hover:text-emerald-700 transition-colors">
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
                        <span className="text-[#101828] font-bold font-serif italic text-xs">
                          {indexDetails.score}%
                        </span>
                      </div>
                      <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${indexDetails.score}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] font-mono text-raiz-gray pt-1">
                        <span>{itemsCount} fragmento(s)</span>
                        <span className="uppercase tracking-tight text-[8px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                          {indexDetails.level.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Active access action row */}
                    <button
                      onClick={() => onSelectProject(proj)}
                      className="mt-5 w-full bg-raiz-bg hover:bg-gradient-to-r hover:from-emerald-600 hover:to-green-500 hover:text-white hover:border-transparent border border-raiz-border py-3 px-4 flex items-center justify-between text-[11px] font-mono tracking-wider uppercase transition-all cursor-pointer rounded-xl font-bold active:scale-[0.99] shadow-xs hover:shadow-md"
                    >
                      <span>Abrir Arquivo Vivo</span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Block - Project Creation Form Panel */}
        {showNewProjectForm && (
          <div className="bg-white border border-raiz-border p-6 rounded-2xl shadow-md space-y-6 animate-fade-in lg:sticky lg:top-[90px] overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-serif italic text-lg text-raiz-dark font-bold">
                Novo Registro de Gênese
              </h3>
              <button
                onClick={() => setShowNewProjectForm(false)}
                className="text-raiz-gray hover:text-raiz-dark p-1.5 hover:bg-raiz-bg rounded-full transition-all cursor-pointer"
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
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label htmlFor="p-name" className="block text-[11px] uppercase font-mono tracking-wider text-raiz-gray font-bold">
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
                  className="w-full bg-[#F9FAFB] border border-gray-200 px-3.5 py-3 text-xs focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-raiz-dark rounded-xl transition-all"
                />
              </div>

              {/* Cultural Context options mapping */}
              <div className="space-y-1">
                <label htmlFor="p-context" className="block text-[11px] uppercase font-mono tracking-wider text-raiz-gray font-bold">
                  Contexto Cultural Principal
                </label>
                <select
                  id="p-context"
                  value={mainCulturalContext}
                  onChange={(e) => setMainCulturalContext(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-gray-200 px-3.5 py-3 text-xs focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-raiz-dark font-sans rounded-xl transition-all"
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
              <div className="space-y-1">
                <label htmlFor="p-objective" className="block text-[11px] uppercase font-mono tracking-wider text-raiz-gray font-bold">
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
                  className="w-full bg-[#F9FAFB] border border-gray-200 px-3.5 py-3 text-xs focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-raiz-dark rounded-xl transition-all"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectForm(false)}
                  className="w-1/3 border border-gray-200 hover:bg-raiz-bg text-raiz-gray font-sans uppercase font-bold tracking-wider text-[10px] py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-create-project-submit"
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-sans uppercase font-bold tracking-wider text-[10px] py-3.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
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
