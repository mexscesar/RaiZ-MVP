import React, { useState } from 'react';
import { Project, RecordItem, RecordType } from '../types';
import { deleteProject, addRecordToProject, removeRecordFromProject } from '../utils';
import { 
  ArrowLeft, Compass, BookOpen, PenTool, Lightbulb, 
  Trash2, Plus, Filter, Calendar, MapPin, Sparkles, CheckCircle2 
} from 'lucide-react';
import InfluenceMap from './InfluenceMap';
import IndexAnalysis from './IndexAnalysis';
import ReportView from './ReportView';

interface ProjectWorkspaceProps {
  project: Project;
  userSessionName: string;
  onBackToDashboard: () => void;
  onUpdateProject: (updatedProject: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

type ActiveTab = 'timeline' | 'map' | 'index' | 'report';

export default function ProjectWorkspace({ 
  project, 
  userSessionName, 
  onBackToDashboard, 
  onUpdateProject,
  onDeleteProject
}: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [filterType, setFilterType] = useState<RecordType | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [recordType, setRecordType] = useState<RecordType>('referencia');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visualManifestation, setVisualManifestation] = useState('');
  const [authorMemory, setAuthorMemory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  // Target item focusing from Influence Map
  const selectRecordFromMap = (recordId: string) => {
    // Switch to timeline tab
    setActiveTab('timeline');
    setFilterType('all');
    // Scroll to the targeted item with soft styling focus
    setTimeout(() => {
      const element = document.getElementById(`record-${recordId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-raiz-green', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-raiz-green', 'ring-offset-2');
        }, 2500);
      }
    }, 150);
  };

  const handleAddRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Por favor, preencha o título e a descrição.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const addedRecord = addRecordToProject(project.id, {
        type: recordType,
        title: title.trim(),
        description: description.trim(),
        category: recordType === 'referencia' ? category.trim() : undefined,
        visualManifestation: recordType === 'decisao' ? visualManifestation.trim() : undefined,
        authorMemory: recordType === 'historia' ? authorMemory.trim() : undefined,
        tags: tags.length > 0 ? tags : undefined
      });

      // Clear form inputs
      setTitle('');
      setDescription('');
      setCategory('');
      setVisualManifestation('');
      setAuthorMemory('');
      setTagsInput('');
      setError('');
      setShowAddForm(false);

      // Reload project state up
      const updatedRecords = [addedRecord, ...(project.records || [])];
      onUpdateProject({
        ...project,
        records: updatedRecords
      });
    } catch (err) {
      setError('Ocorreu um erro ao salvar o registro no banco local.');
    }
  };

  const handleRemoveRecord = (recordId: string) => {
    if (confirm('Tem certeza que deseja remover este registro cultural? Isso afetará os diagramas de enraizamento.')) {
      const updatedProjects = removeRecordFromProject(project.id, recordId);
      const matched = updatedProjects.find(p => p.id === project.id);
      if (matched) {
        onUpdateProject(matched);
      }
    }
  };

  const currentRecords = project.records || [];
  const filteredRecords = filterType === 'all' 
    ? currentRecords 
    : currentRecords.filter(r => r.type === filterType);

  return (
    <div className="space-y-8">
      {/* Top Navigation Back Action and title details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-raiz-border">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-raiz-gray hover:text-raiz-dark transition-colors shrink-0 cursor-pointer select-none no-print"
        >
          <ArrowLeft className="w-4 h-4 text-raiz-terracotta" />
          Voltar aos Arquivos
        </button>

        <div className="text-right flex items-center gap-3 justify-end no-print">
          <span className="text-[10px] text-raiz-gray font-mono">ARQUIVO ATIVO: #{project.id.toUpperCase()}</span>
          <button
            onClick={() => {
              if (confirm('Atenção: Excluir este projeto irá deletar permanentemente todas as referências culturais e históricos documentados do LocalStorage. Deseja prosseguir?')) {
                onDeleteProject(project.id);
              }
            }}
            className="text-xs uppercase font-mono text-red-600 hover:text-red-800 transition-colors cursor-pointer select-none"
          >
            Excluir Projeto
          </button>
        </div>
      </div>

      {/* Project Metadata Banner Section */}
      <div className="bg-white border border-raiz-border p-6 md:p-8 rounded-none relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-raiz-green"></div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="font-serif italic text-3xl font-semibold text-raiz-dark tracking-tight">
              {project.name}
            </h1>
            <span className="inline-block text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 bg-raiz-bg border border-raiz-border text-raiz-terracotta font-semibold shrink-0">
              {project.mainCulturalContext}
            </span>
          </div>

          <div className="space-y-1.5 max-w-3xl">
            <span className="text-[10px] uppercase font-mono tracking-widest text-raiz-gray block">
              Objetivo do Projeto
            </span>
            <p className="text-sm text-raiz-dark/90 leading-relaxed font-sans">
              {project.objective}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Menu Bar */}
      <div className="flex border-b border-raiz-border overflow-x-auto no-print">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-5 py-3 text-xs uppercase font-mono tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'timeline' 
              ? 'border-raiz-green text-raiz-dark font-semibold bg-white' 
              : 'border-transparent text-raiz-gray hover:text-raiz-dark'
          }`}
        >
          📋 Linha do Tempo ({currentRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-5 py-3 text-xs uppercase font-mono tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'map' 
              ? 'border-raiz-green text-raiz-dark font-semibold bg-white' 
              : 'border-transparent text-raiz-gray hover:text-raiz-dark'
          }`}
        >
          🗺️ Mapa de Influências
        </button>
        <button
          onClick={() => setActiveTab('index')}
          className={`px-5 py-3 text-xs uppercase font-mono tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'index' 
              ? 'border-raiz-green text-raiz-dark font-semibold bg-white' 
              : 'border-transparent text-raiz-gray hover:text-raiz-dark'
          }`}
        >
          📊 Índice de Enraizamento
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-5 py-3 text-xs uppercase font-mono tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'report' 
              ? 'border-raiz-green text-raiz-dark font-semibold bg-white' 
              : 'border-transparent text-raiz-gray hover:text-raiz-dark'
          }`}
        >
          ✨ Relatório &amp; Manifesto
        </button>
      </div>

      {/* Screen Views router */}

      {/* VIEW: LINHA DO TEMPO */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed panel - Left (Col-Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Control & Filter toolbar */}
            <div className="bg-white border border-raiz-border p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print">
              <div className="flex items-center gap-2 text-xs font-mono text-raiz-gray">
                <Filter className="w-3.5 h-3.5 text-raiz-terracotta" />
                <span>Filtrar Feed:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Tudo' },
                  { id: 'referencia', label: 'Referências' },
                  { id: 'historia', label: 'Histórias' },
                  { id: 'decisao', label: 'Decisões' },
                  { id: 'reflexao', label: 'Reflexões' }
                ].map((btn) => (
                  <button
                    key={`filter-${btn.id}`}
                    onClick={() => setFilterType(btn.id as RecordType | 'all')}
                    className={`text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 transition-all cursor-pointer ${
                      filterType === btn.id 
                        ? 'bg-raiz-dark text-white' 
                        : 'bg-raiz-bg hover:bg-raiz-border text-raiz-gray'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of items / Feed */}
            {filteredRecords.length === 0 ? (
              <div className="bg-white border border-raiz-border p-12 text-center">
                <Compass className="w-8 h-8 text-raiz-gray/50 mx-auto mb-4 stroke-1 animate-spin" />
                <p className="font-serif italic text-sm text-raiz-dark">
                  {filterType === 'all' 
                    ? 'Este arquivo está completamente em branco.' 
                    : `Não há registros de "${filterType}" correspondentes a este filtro.`}
                </p>
                <p className="text-xs text-raiz-gray mt-2 max-w-xs mx-auto">
                  Utilize o painel lateral de Catalogação para inserir dados contextuais autênticos.
                </p>
              </div>
            ) : (
              <div className="relative border-l border-raiz-border pl-6 ml-4 space-y-8 py-2">
                {filteredRecords.map((rec) => {
                  {/* Colors depending on record type */}
                  const typeColors = {
                    referencia: { badge: 'bg-raiz-green/10 text-raiz-green border-raiz-green/20', label: 'Referência Cultural', dot: 'bg-raiz-green' },
                    historia: { badge: 'bg-amber-100/80 text-amber-800 border-amber-200', label: 'História ou Memória', dot: 'bg-amber-600' },
                    decisao: { badge: 'bg-raiz-terracotta/10 text-raiz-terracotta border-raiz-terracotta/20', label: 'Decisão de Design', dot: 'bg-raiz-terracotta' },
                    reflexao: { badge: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Reflexão Crítica', dot: 'bg-slate-500' }
                  }[rec.type];

                  return (
                    <div 
                      key={rec.id} 
                      id={`record-${rec.id}`}
                      className="bg-white border border-raiz-border p-5 relative transition-all duration-300 hover:shadow-sm"
                    >
                      {/* Anchor Timeline bullet dot outside on left */}
                      <span className={`absolute left-[-29px] top-6 w-2.5 h-2.5 rounded-full ring-4 ring-raiz-bg ${typeColors.dot}`}></span>

                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 border ${typeColors.badge}`}>
                            {typeColors.label}
                          </span>
                          <span className="text-[10px] text-raiz-gray font-mono">
                            {new Date(rec.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveRecord(rec.id)}
                          className="text-raiz-gray hover:text-red-700 transition-colors p-1 no-print cursor-pointer"
                          title="Remover Registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="font-serif italic text-base font-semibold text-raiz-dark mb-2">
                        {rec.title}
                      </h3>

                      <p className="text-xs text-raiz-gray leading-relaxed text-justify whitespace-pre-line">
                        {rec.description}
                      </p>

                      {/* Render type-specific dynamic layouts */}
                      {rec.type === 'referencia' && rec.category && (
                        <div className="mt-3.5 pt-2.5 border-t border-raiz-border flex items-center justify-between text-[11px] text-raiz-gray font-mono">
                          <span>Categoria Etnográfica:</span>
                          <span className="text-raiz-dark font-medium">{rec.category}</span>
                        </div>
                      )}

                      {rec.type === 'historia' && rec.authorMemory && (
                        <div className="mt-3.5 pt-2.5 border-t border-raiz-border flex items-center justify-between text-[11px] text-raiz-gray font-mono">
                          <span>Registros de Tradição por:</span>
                          <span className="text-raiz-dark font-medium italic font-serif">{rec.authorMemory}</span>
                        </div>
                      )}

                      {rec.type === 'decisao' && rec.visualManifestation && (
                        <div className="mt-3.5 p-3 bg-raiz-bg border border-raiz-border text-[11px] leading-relaxed text-raiz-dark font-serif italic">
                          <strong className="font-sans not-italic text-[9px] uppercase tracking-wider text-raiz-terracotta block mb-0.5">Tradução Visual Concreta:</strong>
                          {rec.visualManifestation}
                        </div>
                      )}

                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {rec.tags.map(t => (
                            <span key={t} className="text-[9px] text-raiz-gray font-mono">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Creator Form panel - Right (Col-Span 1) */}
          <div className="space-y-6 no-print">
            <div className="bg-white border border-raiz-border p-6 rounded-none space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif italic text-lg text-raiz-dark">
                  Catalogação de Raiz
                </h3>
                <span className="text-[9px] font-mono uppercase tracking-widest text-raiz-gray">
                  FORMULÁRIO #A
                </span>
              </div>
              <p className="text-xs text-raiz-gray leading-relaxed">
                Adicione as suas descobertas culturais, lembranças coletivas, decisões de desenho ou lições críticas para enriquecer o arquivo estético do projeto.
              </p>

              <hr className="border-raiz-border" />

              {/* Selector for Record Type */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-mono tracking-wider text-raiz-gray">
                  Tipo de Registro
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setRecordType('referencia'); setError(''); }}
                    className={`flex items-center gap-1.5 justify-center py-2.5 px-1 border text-[10px] uppercase font-mono transition-all cursor-pointer ${
                      recordType === 'referencia' 
                        ? 'border-raiz-green bg-raiz-green/5 text-raiz-green font-semibold' 
                        : 'border-raiz-border hover:bg-raiz-bg text-raiz-gray'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Referência
                  </button>
                  <button
                    onClick={() => { setRecordType('historia'); setError(''); }}
                    className={`flex items-center gap-1.5 justify-center py-2.5 px-1 border text-[10px] uppercase font-mono transition-all cursor-pointer ${
                      recordType === 'historia' 
                        ? 'border-amber-600 bg-amber-50/50 text-amber-800 font-semibold' 
                        : 'border-raiz-border hover:bg-raiz-bg text-raiz-gray'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    História
                  </button>
                  <button
                    onClick={() => { setRecordType('decisao'); setError(''); }}
                    className={`flex items-center gap-1.5 justify-center py-2.5 px-1 border text-[10px] uppercase font-mono transition-all cursor-pointer ${
                      recordType === 'decisao' 
                        ? 'border-raiz-terracotta bg-raiz-terracotta/5 text-raiz-terracotta font-semibold' 
                        : 'border-raiz-border hover:bg-raiz-bg text-raiz-gray'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Design Decisão
                  </button>
                  <button
                    onClick={() => { setRecordType('reflexao'); setError(''); }}
                    className={`flex items-center gap-1.5 justify-center py-2.5 px-1 border text-[10px] uppercase font-mono transition-all cursor-pointer ${
                      recordType === 'reflexao' 
                        ? 'border-slate-500 bg-slate-50 text-slate-700 font-semibold' 
                        : 'border-raiz-border hover:bg-raiz-bg text-raiz-gray'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    Reflexão
                  </button>
                </div>
              </div>

              {/* Common Fields */}
              <form onSubmit={handleAddRecordSubmit} className="space-y-4 pt-2">
                {error && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-none">
                    {error}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label htmlFor="rec-title" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                    Título do Registro
                  </label>
                  <input
                    id="rec-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      recordType === 'referencia' ? 'Ex. Literatura de Cordel' :
                      recordType === 'historia' ? 'Ex. Chá de Caxambu de Dona Maria' :
                      recordType === 'decisao' ? 'Ex. Estampa Fractal Sertaneja' :
                      'Ex. O perigo da padronização algorítmica'
                    }
                    className="w-full bg-raiz-bg border border-raiz-border px-3 py-2 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                  />
                </div>

                {/* Type-Specific Custom Fields */}
                {recordType === 'referencia' && (
                  <div>
                    <label htmlFor="rec-category" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                      Subcategoria Cultural
                    </label>
                    <input
                      id="rec-category"
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ex. Artesanato Utilitário, Música, Folclore"
                      className="w-full bg-raiz-bg border border-raiz-border px-3 py-2 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                    />
                  </div>
                )}

                {recordType === 'historia' && (
                  <div>
                    <label htmlFor="rec-author" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                      Contador(a) / Origem da Memória
                    </label>
                    <input
                      id="rec-author"
                      type="text"
                      value={authorMemory}
                      onChange={(e) => setAuthorMemory(e.target.value)}
                      placeholder="Ex. Relato ancestral oral / Comunidade Quilombola"
                      className="w-full bg-raiz-bg border border-raiz-border px-3 py-2 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                    />
                  </div>
                )}

                {recordType === 'decisao' && (
                  <div>
                    <label htmlFor="rec-manifestation" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                      Manifestação Estética no Produto
                    </label>
                    <textarea
                      id="rec-manifestation"
                      rows={2}
                      value={visualManifestation}
                      onChange={(e) => setVisualManifestation(e.target.value)}
                      placeholder="Ex. Como essa referência inspirou a paleta de cores argilosas e o corte chanfrado do tampo da mesa."
                      className="w-full bg-raiz-bg border border-raiz-border px-3 py-2 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label htmlFor="rec-desc" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                    Descrição Detalhada / Narrativa
                  </label>
                  <textarea
                    id="rec-desc"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Documente as influências sociais, simbolismos ou argumentos técnicos que provam a conexão deste ecossistema criativo."
                    className="w-full bg-raiz-bg border border-raiz-border px-3 py-2 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="rec-tags" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-1.5">
                    Tags Chave (separadas por vírgula)
                  </label>
                  <input
                    id="rec-tags"
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="sertao, entalhe, argila, ancestralidade"
                    className="w-full bg-raiz-bg border border-raiz-border px-3 py-2 text-xs focus:outline-none focus:border-raiz-green text-raiz-dark"
                  />
                </div>

                <button
                  id="btn-add-record-submit"
                  type="submit"
                  className="w-full bg-raiz-green hover:bg-raiz-green/90 text-white font-sans uppercase font-medium tracking-wider text-[10px] py-3.5 transition-colors cursor-pointer"
                >
                  Registar no Arquivo Vivo
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MAPA DE INFLUÊNCIAS */}
      {activeTab === 'map' && (
        <InfluenceMap 
          project={project} 
          onSelectRecord={selectRecordFromMap} 
        />
      )}

      {/* VIEW: ÍNDICE DE ENRAIZAMENTO CULTURAL */}
      {activeTab === 'index' && (
        <IndexAnalysis project={project} />
      )}

      {/* VIEW: RELATÓRIO & MANIFESTO */}
      {activeTab === 'report' && (
        <ReportView 
          project={project} 
          userSessionName={userSessionName} 
        />
      )}
    </div>
  );
}
