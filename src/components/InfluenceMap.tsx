import React, { useState } from 'react';
import { Project, RecordItem, RecordType } from '../types';
import { Share2, BookOpen, PenTool, Lightbulb, Compass, Info } from 'lucide-react';

interface InfluenceMapProps {
  project: Project;
  onSelectRecord?: (recordId: string) => void;
}

export default function InfluenceMap({ project, onSelectRecord }: InfluenceMapProps) {
  const [hoveredNode, setHoveredNode] = useState<RecordItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<RecordType | null>(null);

  const records = project.records || [];

  // Group records by type
  const refs = records.filter(r => r.type === 'referencia');
  const hists = records.filter(r => r.type === 'historia');
  const decs = records.filter(r => r.type === 'decisao');
  const refls = records.filter(r => r.type === 'reflexao');

  // SVG Coordinates setup (Viewbox is 800 x 480)
  const center = { x: 400, y: 240 }; // Project center

  const categoryHubs: Record<RecordType, { x: number; y: number; label: string; color: string; icon: string }> = {
    referencia: { x: 180, y: 130, label: "Referências Culturais", color: "#2F6F4F", icon: "Compass" },
    historia: { x: 180, y: 350, label: "Histórias & Memórias", color: "#D17D56", icon: "BookOpen" },
    decisao: { x: 620, y: 130, label: "Decisões de Design", color: "#B76E4D", icon: "PenTool" },
    reflexao: { x: 620, y: 350, label: "Reflexões de Estágio", color: "#5F7E8A", icon: "Lightbulb" }
  };

  const getRecordCoordinates = (type: RecordType, idx: number, total: number) => {
    const hub = categoryHubs[type];
    if (total === 1) {
      return { x: type === 'referencia' || type === 'historia' ? hub.x - 70 : hub.x + 70, y: hub.y };
    }
    
    // Spread them in a small arc away from the center
    const isLeft = type === 'referencia' || type === 'historia';
    const angleRange = Math.PI * 0.8; // 144 degrees
    const baseAngle = isLeft ? Math.PI : 0;
    const step = total > 1 ? angleRange / (total - 1) : 0;
    const startAngle = baseAngle - angleRange / 2;
    
    const angle = startAngle + idx * step;
    const radius = 90; // distance from hub
    
    return {
      x: Math.round(hub.x + Math.cos(angle) * radius),
      y: Math.round(hub.y + Math.sin(angle) * radius)
    };
  };

  return (
    <div className="bg-white border border-raiz-border p-6 md:p-8 rounded-none relative">
      <div className="absolute top-4 right-4 bg-raiz-bg px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider text-raiz-gray border border-raiz-border flex items-center gap-1.5 no-print">
        <Share2 className="w-3 h-3 text-raiz-terracotta animate-pulse" />
        Sincronia Estética Ativa
      </div>

      <div className="mb-6">
        <h3 className="font-serif italic text-lg text-raiz-dark">
          Ecosistema de Mapeamento
        </h3>
        <p className="text-xs text-raiz-gray">
          Conexões simbólicas e estruturais documentadas para o projeto <strong className="text-raiz-dark/90 font-medium">{project.name}</strong>.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="border border-dashed border-raiz-border bg-raiz-bg/50 p-12 text-center my-8">
          <Compass className="w-8 h-8 text-raiz-gray/60 mx-auto mb-4 stroke-1" />
          <p className="font-serif italic text-sm text-raiz-dark">Falta raízes para ramificar este mapa</p>
          <p className="text-xs text-raiz-gray mt-2 max-w-sm mx-auto">
            Adicione referências culturais, fragmentos de histórias coletivas ou decisões visuais para ver os nós de conexões florescerem em sua jornada.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main SVG Graphic */}
          <div className="border border-raiz-border bg-[#FCFAF7] overflow-x-auto relative rounded-sm p-2">
            <svg 
              viewBox="0 0 800 480" 
              className="w-full min-w-[700px] h-auto select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG Filters for soft shadows */}
              <defs>
                <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* LINES: Category Hubs to Project Center */}
              {Object.entries(categoryHubs).map(([type, hub]) => {
                const count = records.filter(r => r.type === type).length;
                const pathD = `M ${center.x} ${center.y} Q ${(center.x + hub.x)/2} ${(center.y + hub.y)/2 + (type === 'referencia' || type === 'decisao' ? -20 : 20)} ${hub.x} ${hub.y}`;
                return (
                  <path
                    key={`hub-line-${type}`}
                    d={pathD}
                    fill="none"
                    stroke={hub.color}
                    strokeWidth={count > 0 ? "1.5" : "0.75"}
                    strokeDasharray={count > 0 ? undefined : "4 4"}
                    opacity={count > 0 ? "0.75" : "0.3"}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* SATELLITE LINES: Records to Hubs */}
              {refs.map((rec, idx) => {
                const coords = getRecordCoordinates('referencia', idx, refs.length);
                const hub = categoryHubs.referencia;
                return (
                  <g key={`line-ref-${rec.id}`}>
                    <path
                      d={`M ${hub.x} ${hub.y} L ${coords.x} ${coords.y}`}
                      fill="none"
                      stroke={hub.color}
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  </g>
                );
              })}

              {hists.map((rec, idx) => {
                const coords = getRecordCoordinates('historia', idx, hists.length);
                const hub = categoryHubs.historia;
                return (
                  <g key={`line-hist-${rec.id}`}>
                    <path
                      d={`M ${hub.x} ${hub.y} L ${coords.x} ${coords.y}`}
                      fill="none"
                      stroke={hub.color}
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  </g>
                );
              })}

              {decs.map((rec, idx) => {
                const coords = getRecordCoordinates('decisao', idx, decs.length);
                const hub = categoryHubs.decisao;
                return (
                  <g key={`line-dec-${rec.id}`}>
                    <path
                      d={`M ${hub.x} ${hub.y} L ${coords.x} ${coords.y}`}
                      fill="none"
                      stroke={hub.color}
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  </g>
                );
              })}

              {refls.map((rec, idx) => {
                const coords = getRecordCoordinates('reflexao', idx, refls.length);
                const hub = categoryHubs.reflexao;
                return (
                  <g key={`line-refl-${rec.id}`}>
                    <path
                      d={`M ${hub.x} ${hub.y} L ${coords.x} ${coords.y}`}
                      fill="none"
                      stroke={hub.color}
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  </g>
                );
              })}


              {/* CENTRAL NODE: The Project Core */}
              <g className="cursor-default">
                <circle
                  cx={center.x}
                  cy={center.y}
                  r="34"
                  fill="#F8F7F3"
                  stroke="#1D2939"
                  strokeWidth="2.5"
                />
                <circle
                  cx={center.x}
                  cy={center.y}
                  r="28"
                  fill="none"
                  stroke="#1D2939"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={center.x}
                  y={center.y + 4}
                  textAnchor="middle"
                  fontFamily="Playfair Display, serif"
                  fontWeight="600"
                  fontStyle="italic"
                  fontSize="13"
                  fill="#1D2939"
                >
                  RAIZ
                </text>
                {/* Visual outline ring */}
                <circle
                  cx={center.x}
                  cy={center.y}
                  r="42"
                  fill="none"
                  stroke="#1D2939"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              </g>


              {/* CATEGORY NODES (HUBS) */}
              {Object.entries(categoryHubs).map(([type, hub]) => {
                const activeRecs = records.filter(r => r.type === type);
                const count = activeRecs.length;
                const isHubActive = activeCategory === type;

                return (
                  <g 
                    key={`hub-node-${type}`} 
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setActiveCategory(type as RecordType)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    {/* Ring highlight on active or hover */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="24"
                      fill={hub.color}
                      opacity={isHubActive ? "0.2" : "0.08"}
                    />
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="16"
                      fill="#FFFFFF"
                      stroke={hub.color}
                      strokeWidth={count > 0 ? "2" : "1.5"}
                    />
                    {/* Counter size anchor */}
                    {count > 0 && (
                      <circle
                        cx={hub.x + 11}
                        cy={hub.y - 11}
                        r="8"
                        fill={hub.color}
                      />
                    )}
                    {count > 0 && (
                      <text
                        x={hub.x + 11}
                        y={hub.y - 8}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="semibold"
                        fontFamily="sans-serif"
                      >
                        {count}
                      </text>
                    )}

                    {/* Icon details in text as fallback representation since we want it super clean */}
                    <text
                      x={hub.x}
                      y={hub.y + 4}
                      textAnchor="middle"
                      fontSize="14"
                      fill={hub.color}
                    >
                      {type === 'referencia' ? '🧭' : type === 'historia' ? '📖' : type === 'decisao' ? '📐' : '💡'}
                    </text>

                    {/* Hub label text */}
                    <text
                      x={hub.x}
                      y={hub.y + 32}
                      textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                      fontSize="10"
                      fontWeight="600"
                      fill="#1D2939"
                      className="tracking-wider text-[9px] uppercase"
                    >
                      {hub.label.split(" ")[0]}
                    </text>
                    <text
                      x={hub.x}
                      y={hub.y + 42}
                      textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                      fontSize="9"
                      fill="#667085"
                    >
                      {hub.label.split(" ").slice(1).join(" ")}
                    </text>
                  </g>
                );
              })}


              {/* RECORD NODES (SATELLITES) */}
              {refs.map((rec, idx) => {
                const coords = getRecordCoordinates('referencia', idx, refs.length);
                const isHovered = hoveredNode?.id === rec.id;
                return (
                  <g 
                    key={`node-${rec.id}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(rec)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => onSelectRecord && onSelectRecord(rec.id)}
                  >
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isHovered ? "12" : "7"}
                      fill="#2F6F4F"
                      className="transition-all duration-200"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    {isHovered && (
                      <line
                        x1={coords.x}
                        y1={coords.y}
                        x2={coords.x}
                        y2={coords.y - 16}
                        stroke="#2F6F4F"
                        strokeWidth="1"
                      />
                    )}
                  </g>
                );
              })}

              {hists.map((rec, idx) => {
                const coords = getRecordCoordinates('historia', idx, hists.length);
                const isHovered = hoveredNode?.id === rec.id;
                return (
                  <g 
                    key={`node-${rec.id}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(rec)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => onSelectRecord && onSelectRecord(rec.id)}
                  >
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isHovered ? "12" : "7"}
                      fill="#D17D56"
                      className="transition-all duration-200"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {decs.map((rec, idx) => {
                const coords = getRecordCoordinates('decisao', idx, decs.length);
                const isHovered = hoveredNode?.id === rec.id;
                return (
                  <g 
                    key={`node-${rec.id}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(rec)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => onSelectRecord && onSelectRecord(rec.id)}
                  >
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isHovered ? "12" : "7"}
                      fill="#B76E4D"
                      className="transition-all duration-200"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {refls.map((rec, idx) => {
                const coords = getRecordCoordinates('reflexao', idx, refls.length);
                const isHovered = hoveredNode?.id === rec.id;
                return (
                  <g 
                    key={`node-${rec.id}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(rec)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => onSelectRecord && onSelectRecord(rec.id)}
                  >
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isHovered ? "12" : "7"}
                      fill="#5F7E8A"
                      className="transition-all duration-200"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Connected Context Bar on Hover or Category Info */}
          <div className="bg-raiz-bg p-4 border border-raiz-border flex flex-col md:flex-row justify-between gap-4 transition-all min-h-[90px]">
            {hoveredNode ? (
              <div className="w-full flex items-start gap-3 animate-fade-in">
                <span className="text-xl">
                  {hoveredNode.type === 'referencia' ? '🧭' : hoveredNode.type === 'historia' ? '📖' : hoveredNode.type === 'decisao' ? '📐' : '💡'}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 bg-white border border-raiz-border text-raiz-gray">
                      {hoveredNode.type === 'referencia' ? 'Referência' : hoveredNode.type === 'historia' ? 'História/Memória' : hoveredNode.type === 'decisao' ? 'Decisão de Design' : 'Reflexão'}
                    </span>
                    <span className="text-[10px] text-raiz-gray font-mono">
                      revelado no mapa
                    </span>
                  </div>
                  <h4 className="font-serif italic text-sm text-raiz-dark font-semibold">
                    {hoveredNode.title}
                  </h4>
                  <p className="text-xs text-raiz-gray line-clamp-2 leading-relaxed">
                    {hoveredNode.description}
                  </p>
                  <p className="text-[10px] text-raiz-gray italic font-mono pt-1">
                    Clique no nó para focar na linha do tempo.
                  </p>
                </div>
              </div>
            ) : activeCategory ? (
              <div className="w-full flex items-start gap-3">
                <span className="text-xl">ℹ️</span>
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-wider text-raiz-dark font-semibold mb-0.5">
                    Hub: {categoryHubs[activeCategory].label}
                  </h4>
                  <p className="text-xs text-raiz-gray max-w-xl">
                    Este hemisfério conecta todos os registros classificados como {categoryHubs[activeCategory].label.toLowerCase()}. {
                      activeCategory === 'referencia' ? 'Eles representam tradições, artefatos e manifestações populares.' :
                      activeCategory === 'historia' ? 'Eles guardam memórias afetivas, relatos de pioneiros e lendas locais.' :
                      activeCategory === 'decisao' ? 'Eles documentam como o contexto influenciou cores, materiais, formas e tipografias.' :
                      'Eles expressam revisões críticas e aprendizados profundos do designer durante o processo coletivo.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center gap-2.5 text-raiz-gray text-xs">
                <Info className="w-4 h-4 text-raiz-terracotta shrink-0" />
                <span>
                  Passe o mouse por cima dos <strong className="text-raiz-dark/80 font-medium">nós circulares coloridos</strong> para inspecionar os fragmentos de raiz acumulados, ou passe sobre as <strong className="text-raiz-dark/80 font-medium">macro-categorias</strong> para ver as definições do ecossistema.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
