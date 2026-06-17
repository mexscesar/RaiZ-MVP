import React from 'react';
import { Project } from '../types';
import { calculateEmbeddingIndex, formatDate } from '../utils';
import { Printer, Calendar, FileText, Compass, Award } from 'lucide-react';

interface ReportViewProps {
  project: Project;
  userSessionName: string;
}

export default function ReportView({ project, userSessionName }: ReportViewProps) {
  const analysis = calculateEmbeddingIndex(project);
  const records = project.records || [];

  const handlePrint = () => {
    window.print();
  };

  // Group records by type for visual separation in the report
  const refs = records.filter(r => r.type === 'referencia');
  const hists = records.filter(r => r.type === 'historia');
  const decs = records.filter(r => r.type === 'decisao');
  const refls = records.filter(r => r.type === 'reflexao');

  return (
    <div className="space-y-6">
      {/* Top action controller - Hidden in the print version */}
      <div className="bg-white border border-raiz-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h4 className="font-serif italic text-sm text-raiz-dark font-semibold">
            Exportação do Manifesto Cultural
          </h4>
          <p className="text-xs text-raiz-gray">
            Gere um documento de herança contendo todas as descrições em alta fidelidade pronto para envio a clientes, inclusão em portfólios ou impressão física.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-raiz-green hover:bg-raiz-green/90 text-white font-sans uppercase font-medium tracking-wider text-xs px-5 py-2.5 transition-colors cursor-pointer select-none shrink-0"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Exportar PDF
        </button>
      </div>

      {/* The Printable Page Sheet */}
      <div 
        id="print-sheet" 
        className="bg-white border border-raiz-border p-8 md:p-12 shadow-sm font-sans relative max-w-4xl mx-auto overflow-hidden leading-relaxed"
      >
        {/* Archival Decorative Frame Details */}
        <div className="absolute top-0 left-0 w-full h-1 bg-raiz-dark"></div>
        <div className="flex justify-between items-start border-b-2 border-raiz-dark pb-6 mb-8">
          <div>
            <span className="font-serif italic text-2xl font-bold tracking-tight text-raiz-dark">
              RAIZ
            </span>
            <span className="text-[10px] block uppercase font-mono tracking-widest text-raiz-gray mt-1">
              Registro de Patrimônio Cultural em Design
            </span>
          </div>
          <div className="text-right text-xs font-mono text-raiz-gray space-y-0.5">
            <div>CÓDIGO: RZ-{project.id.toUpperCase()}</div>
            <div>EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</div>
            <div>VERSÃO: 1.0.3-PROD</div>
          </div>
        </div>

        {/* Project Header Summary */}
        <div className="space-y-4 mb-8">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-raiz-terracotta font-semibold block mb-1">
              PROJETO COM DOCUMENTAÇÃO ATIVA
            </span>
            <h1 className="font-serif italic text-3xl font-semibold text-raiz-dark tracking-tight">
              {project.name}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-raiz-gray block">
                Contexto Cultural Principal
              </span>
              <span className="text-sm font-medium text-raiz-dark font-sans block mt-0.5">
                {project.mainCulturalContext}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-raiz-gray block">
                Designer Responsável
              </span>
              <span className="text-sm font-medium text-raiz-dark font-sans block mt-0.5">
                {userSessionName}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-raiz-gray block">
              Objetivo e Manifestação de Futuros
            </span>
            <p className="text-xs text-raiz-dark/90 italic font-serif leading-relaxed mt-1 bg-raiz-bg/55 p-3.5 border-l border-raiz-terracotta">
              &ldquo;{project.objective}&rdquo;
            </p>
          </div>
        </div>

        {/* Rooting Index Metric */}
        <div className="border border-raiz-dark p-4 bg-[#FCFAF7] grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-10">
          <div className="md:col-span-2 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-raiz-gray block">
              Indicador de Pertencimento
            </span>
            <h3 className="text-sm font-sans font-bold text-raiz-dark uppercase tracking-wide">
              Índice de Enraizamento Cultural
            </h3>
            <p className="text-[11px] text-raiz-gray leading-tight">
              Calculado estatisticamente em tempo real baseado no volume documental, equilíbrio prático e diversidade etnográfica.
            </p>
          </div>
          <div className="text-center py-2 md:py-0 md:border-l border-raiz-border">
            <div className="font-serif italic text-3xl font-bold text-raiz-dark">
              {analysis.score} / 100
            </div>
            <div className="text-[9px] uppercase font-mono tracking-widest text-raiz-terracotta font-semibold mt-1">
              {analysis.level}
            </div>
          </div>
        </div>

        {/* Section: Principal References Registradas */}
        <div className="space-y-6 mb-10">
          <h2 className="font-serif italic text-lg text-raiz-dark border-b border-raiz-dark pb-1.5 flex items-center gap-2">
            <Compass className="w-4 h-4 text-raiz-green shrink-0" />
            1. Referências Culturais Preservadas
          </h2>
          {refs.length === 0 ? (
            <p className="text-xs font-serif italic text-raiz-gray">Nenhuma referência explícita declarada.</p>
          ) : (
            <div className="space-y-4">
              {refs.map((rec) => (
                <div key={rec.id} className="border-l-2 border-raiz-green pl-4 py-1">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <h4 className="font-sans font-semibold text-xs text-raiz-dark uppercase tracking-wide">
                      {rec.title}
                    </h4>
                    {rec.category && (
                      <span className="text-[9px] uppercase font-mono text-raiz-gray">
                        Categoria: {rec.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-raiz-gray leading-relaxed text-justify">
                    {rec.description}
                  </p>
                  {rec.tags && rec.tags.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {rec.tags.map(t => (
                        <span key={t} className="text-[9px] font-mono text-raiz-gray">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Memorias e Relatos */}
        {hists.length > 0 && (
          <div className="space-y-6 mb-10">
            <h2 className="font-serif italic text-lg text-raiz-dark border-b border-raiz-dark pb-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-raiz-green shrink-0" />
              2. Linha do Tempo Ancestral, Relatos e Memórias
            </h2>
            <div className="space-y-4">
              {hists.map((rec) => (
                <div key={rec.id} className="border-l-2 border-amber-600 pl-4 py-1">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <h4 className="font-sans font-semibold text-xs text-raiz-dark uppercase tracking-wide">
                      {rec.title}
                    </h4>
                    {rec.authorMemory && (
                      <span className="text-[9px] font-mono text-amber-700 font-medium">
                        Fonte: {rec.authorMemory}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-raiz-gray leading-relaxed text-justify">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Aplicacao de Design e Decisoes */}
        {decs.length > 0 && (
          <div className="space-y-6 mb-10">
            <h2 className="font-serif italic text-lg text-raiz-dark border-b border-raiz-dark pb-1.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-raiz-green shrink-0" />
              3. Decisões de Design de Futuros
            </h2>
            <div className="space-y-4">
              {decs.map((rec) => (
                <div key={rec.id} className="border-l-2 border-raiz-terracotta pl-4 py-1">
                  <h4 className="font-sans font-semibold text-xs text-raiz-dark uppercase tracking-wide mb-0.5">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-raiz-gray leading-relaxed mb-1 text-justify">
                    {rec.description}
                  </p>
                  {rec.visualManifestation && (
                    <div className="bg-raiz-bg p-2 border border-raiz-border text-[11px] leading-relaxed italic text-raiz-dark mt-1 font-serif">
                      <strong className="font-sans not-italic font-bold text-[9px] uppercase tracking-wider text-raiz-terracotta block mb-0.5">Manifestação Estética Concreta:</strong>
                      {rec.visualManifestation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Reflexoes Criticas */}
        {refls.length > 0 && (
          <div className="space-y-6 mb-10">
            <h2 className="font-serif italic text-lg text-raiz-dark border-b border-raiz-dark pb-1.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-raiz-green shrink-0" />
              4. Reflexões e Consciência do Processo
            </h2>
            <div className="space-y-4">
              {refls.map((rec) => (
                <div key={rec.id} className="border-l-2 border-[#5F7E8A] pl-4 py-1">
                  <h4 className="font-sans font-semibold text-xs text-raiz-dark uppercase tracking-wide mb-0.5">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-raiz-gray leading-relaxed text-justify">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Combined summary timeline */}
        <div className="border-t border-raiz-dark pt-8 mb-12">
          <h3 className="text-xs uppercase font-mono tracking-widest text-raiz-gray mb-4">
            Linha do Tempo de Mapeamento Geral do Projeto
          </h3>
          {records.length === 0 ? (
            <p className="text-xs text-raiz-gray italic">Sem registros cronológicos inseridos.</p>
          ) : (
            <div className="space-y-2.5">
              {[...records].reverse().map((rec, idx) => (
                <div key={`sum-timeline-${rec.id}`} className="flex items-center justify-between text-xs font-mono py-1 border-b border-raiz-border/50 text-raiz-gray">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] w-5 text-right">{String(idx + 1).padStart(2, '0')}.</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.5 bg-raiz-bg border border-raiz-border text-raiz-dark/80 shrink-0">
                      {rec.type === 'referencia' ? 'REF' : rec.type === 'historia' ? 'MEM' : rec.type === 'decisao' ? 'DES' : 'REFLEX'}
                    </span>
                    <span className="text-raiz-dark font-sans font-medium line-clamp-1 max-w-sm">
                      {rec.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-right shrink-0">
                    {new Date(rec.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manifest Footer Message Required by User */}
        <div className="mt-12 pt-8 border-t border-raiz-dark flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <p className="text-xs font-serif italic text-raiz-dark font-semibold leading-relaxed max-w-md">
              &ldquo;Este projeto registra suas influências culturais e contextuais através da plataforma RAIZ.&rdquo;
            </p>
            <p className="text-[10px] text-raiz-gray font-mono uppercase tracking-widest">
              Salvaguardando memória humana — Projeto em Design futures de cura estética
            </p>
          </div>

          {/* Graphical Stamp Placeholder to look highly curated like Cosmos/Museum */}
          <div className="border-2 border-raiz-dark p-2 text-center w-28 shrink-0 select-none">
            <div className="text-[7px] font-mono uppercase tracking-[0.2em] text-raiz-gray mb-0.5">PRODUTO HUMANO</div>
            <div className="font-serif italic font-bold text-sm border-y border-raiz-dark py-0.5">CERTIFICADO</div>
            <div className="text-[7px] font-mono tracking-widest text-raiz-gray mt-1">SISTEMA RAIZ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
