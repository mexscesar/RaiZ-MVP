import React from 'react';
import { Project } from '../types';
import { calculateEmbeddingIndex } from '../utils';
import { ShieldCheck, Sparkles, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface IndexAnalysisProps {
  project: Project;
}

export default function IndexAnalysis({ project }: IndexAnalysisProps) {
  const analysis = calculateEmbeddingIndex(project);
  const totalRecords = project.records?.length || 0;

  // Find out what is missing to give customized recommendation
  const recordTypes = project.records?.map(r => r.type) || [];
  const hasRef = recordTypes.includes('referencia');
  const hasHist = recordTypes.includes('historia');
  const hasDec = recordTypes.includes('decisao');
  const hasRefl = recordTypes.includes('reflexao');

  const getRecommendation = () => {
    if (totalRecords === 0) {
      return "Para começar, registre a sua primeira Referência Cultural ou História Local inspiradora. O seu primeiro registro ativará a análise de enraizamento.";
    }
    const missing = [];
    if (!hasRef) missing.push("Referências Culturais");
    if (!hasHist) missing.push("Histórias e Memórias Locais");
    if (!hasDec) missing.push("Decisões de Design (como a influência se faz visível)");
    if (!hasRefl) missing.push("Reflexões de Estágio (aprendizados)");

    if (missing.length === 0) {
      return "Excelente! Seu projeto atingiu o máximo de diversidade categórica. Continue adicionando registros ricos para subir o volume substancial e consolidar seu patrimônio cultural contra a homogeneização algorítmica.";
    }

    return `Para enraizar ainda mais o projeto, experimente registrar: ${missing[0]}. Isso dará um salto de até 15 ou 20 pontos no seu índice médio de equilíbrio.`;
  };

  return (
    <div className="bg-white border border-raiz-border p-6 md:p-8 rounded-none space-y-8">
      {/* Dynamic Header and Explanation */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-6 border-b border-raiz-border">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-raiz-green animate-ping"></span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-raiz-green font-semibold">
              MÉTRICA DE SALVAGUARDA CULTURAL
            </span>
          </div>
          <h3 className="font-serif italic text-2xl text-raiz-dark">
            Índice de Enraizamento Cultural
          </h3>
          <p className="text-xs text-raiz-gray leading-relaxed italic">
            &ldquo;Este índice representa o nível de contextualização cultural documentada neste projeto.&rdquo;
          </p>
          <div className="pt-2 flex items-start gap-1 p-3 bg-raiz-bg rounded-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-raiz-green shrink-0 mt-0.5" />
            <p className="text-[10px] text-raiz-gray font-mono leading-tight uppercase">
              Nota de Isenção: Este índice NÃO avalia valor estético, talento individual, qualidade comercial ou autoria legal. Mede estritamente o rigor documental duma herança social viva.
            </p>
          </div>
        </div>

        {/* Dynamic score visualization circle */}
        <div className="flex items-center gap-5 shrink-0 bg-[#FCFAF7] p-4 border border-raiz-border w-full lg:w-auto justify-center lg:justify-start">
          <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-raiz-border">
            <div className="text-center">
              <span className="font-serif italic text-3xl font-bold text-raiz-dark block -mb-1">
                {analysis.score}
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-raiz-gray">
                PONTOS
              </span>
            </div>
            {/* Minimal line tracing the score outside visually */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="#2F6F4F"
                strokeWidth="1.5"
                strokeDasharray={`${(analysis.score / 100) * 276} 276`}
                opacity="0.8"
                className="transition-all duration-500"
              />
            </svg>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-raiz-gray block mb-1">
              ESTADO DO PROJETO
            </span>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 uppercase tracking-wider border rounded-none ${analysis.levelColor}`}>
              {analysis.level}
            </span>
            <span className="text-[10px] text-raiz-gray block mt-2 font-mono">
              Baseado em {totalRecords} termo(s) catalogado(s)
            </span>
          </div>
        </div>
      </div>

      {/* Numerical breakdown with beautiful custom styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Volumetria */}
        <div className="border border-raiz-border p-5 bg-white relative">
          <div className="absolute top-0 right-4 translate-y-[-50%] bg-white border border-raiz-border text-[9px] font-mono tracking-wider px-2 py-0.5 text-raiz-gray">
            CRI-1: VOLUME
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs uppercase font-mono tracking-wide text-raiz-dark font-semibold">
                Suficiência de Registro
              </h4>
              <span className="font-mono text-xs text-raiz-green font-semibold">
                {analysis.breakdown.volumeScore}/35 pts
              </span>
            </div>
            <p className="text-xs text-raiz-gray leading-relaxed">
              Mede a quantidade bruta de fragmentos documentados. Projetos com mais de 5 registros maduros atingem o topo da métrica quantitativa.
            </p>
            <div className="w-full bg-raiz-bg h-1 rounded-none overflow-hidden/20">
              <div
                className="bg-raiz-green h-full transition-all duration-500"
                style={{ width: `${(analysis.breakdown.volumeScore / 35) * 100}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-raiz-gray flex justify-between font-mono">
              <span>{Math.min(5, totalRecords)} de 5 recomendados</span>
              <span>Min. Alcançado</span>
            </div>
          </div>
        </div>

        {/* 2. Diversidade */}
        <div className="border border-raiz-border p-5 bg-white relative">
          <div className="absolute top-0 right-4 translate-y-[-50%] bg-white border border-raiz-border text-[9px] font-mono tracking-wider px-2 py-0.5 text-raiz-gray">
            CRI-2: CONEXÕES
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs uppercase font-mono tracking-wide text-raiz-dark font-semibold">
                Diversidade de Eixos
              </h4>
              <span className="font-mono text-xs text-raiz-green font-semibold">
                {analysis.breakdown.diversityScore}/35 pts
              </span>
            </div>
            <p className="text-xs text-raiz-gray leading-relaxed">
              Avalia quantas facetas criativas foram interconectadas no mapeamento (referências materiais vs. memórias narrativas locais).
            </p>
            <div className="w-full bg-raiz-bg h-1 rounded-none overflow-hidden/20">
              <div
                className="bg-raiz-terracotta h-full transition-all duration-500"
                style={{ width: `${(analysis.breakdown.diversityScore / 35) * 100}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-raiz-gray flex justify-between font-mono">
              <span>{[hasRef, hasHist, hasDec, hasRefl].filter(Boolean).length} de 4 Tipologias</span>
              <span>Análise Vetorial</span>
            </div>
          </div>
        </div>

        {/* 3. Equilíbrio */}
        <div className="border border-raiz-border p-5 bg-white relative">
          <div className="absolute top-0 right-4 translate-y-[-50%] bg-white border border-raiz-border text-[9px] font-mono tracking-wider px-2 py-0.5 text-raiz-gray">
            CRI-3: HARMONIA
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs uppercase font-mono tracking-wide text-raiz-dark font-semibold">
                Equilíbrio de Gênese
              </h4>
              <span className="font-mono text-xs text-raiz-green font-semibold">
                {analysis.breakdown.balanceScore}/30 pts
              </span>
            </div>
            <p className="text-xs text-raiz-gray leading-relaxed">
              Recompensa projetos cuja distribuição de registros divide-se harmoniosamente entre ideação conceitual e aplicações estéticas práticas.
            </p>
            <div className="w-full bg-raiz-bg h-1 rounded-none overflow-hidden/20">
              <div
                className="bg-raiz-dark h-full transition-all duration-500"
                style={{ width: `${(analysis.breakdown.balanceScore / 30) * 100}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-raiz-gray flex justify-between font-mono">
              <span>Sinergia Distribuída</span>
              <span>Desvio Baixo: {analysis.breakdown.balanceScore >= 25 ? 'Sim ✓' : 'Não'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Futures Design Recommendation Box */}
      <div className="bg-[#FCFAF7] border border-raiz-border p-5 flex items-start gap-4">
        <div className="p-2.5 bg-white border border-raiz-border shrink-0">
          <Lightbulb className="w-5 h-5 text-raiz-terracotta" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-serif italic text-sm text-raiz-dark font-semibold">
            Recomendações do Product Designer de Futuros
          </h4>
          <p className="text-xs text-raiz-gray leading-relaxed">
            {getRecommendation()}
          </p>
          <div className="pt-2">
            <span className="text-[9px] font-mono text-raiz-terracotta uppercase tracking-[0.15em] font-medium block">
              ESTRATÉGIA DE DESIGN DE FUTUROS CONTINUADA // RAIZ PLATFORM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
