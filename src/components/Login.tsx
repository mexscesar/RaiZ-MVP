import React, { useState } from 'react';
import { UserSession } from '../types';
import { storeUser } from '../utils';
import { User, Mail, ArrowRight, ShieldCheck, Sparkles, Lock } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    const session = storeUser(name.trim(), email.trim());
    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#051F14] via-[#0D301E] to-[#12422A] font-sans relative overflow-hidden px-4 py-12 md:py-20 select-none">
      
      {/* Decorative modern radial glows to mimic the gorgeous orchid-glow from the mockups but in cool minty shades */}
      <div className="absolute top-[-20%] right-[-20%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-emerald-500/10 rounded-full blur-[100px] md:blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-green-400/8 rounded-full blur-[100px] md:blur-[160px] pointer-events-none"></div>
      
      {/* Absolute top dashboard details floating like the mockup */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 text-white/95">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-4.5 h-4.5 text-[#051F14]" />
          </div>
          <span className="font-serif italic font-bold text-xl tracking-tight text-white select-none">
            RAIZ
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-wide text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PROCESSO CRIATIVO VERIFICÁVEL</span>
        </div>
      </div>

      {/* Main Login Card - pristine white with rounded-3xl corners & gorgeous shadow */}
      <div className="max-w-[460px] w-full bg-white text-raiz-dark rounded-[28px] shadow-2xl shadow-emerald-950/40 p-8 md:p-10 border border-white/10 relative z-10">
        
        {/* Discrete index tag showing system information */}
        <div className="absolute -top-3.5 right-8 bg-emerald-950 text-emerald-300 font-mono text-[9px] tracking-widest uppercase py-1 px-3.5 rounded-full border border-emerald-800">
          GABINETE // ACESSO #001
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827]">
            Bem-vindo ao <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 bg-clip-text text-transparent font-serif italic text-3xl">RAIZ</span>
          </h1>
          <p className="mt-2.5 text-xs md:text-sm text-raiz-gray leading-relaxed max-w-sm mx-auto">
            Diferencie seu trabalho em um mundo saturado por IA. Documente seu processo criativo humano e gere certificados.
          </p>
        </div>

        {/* Narrative beautiful contextual callout banner */}
        <div className="mb-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs leading-relaxed text-emerald-900 font-sans flex items-start gap-3">
          <span className="text-base select-none mt-0.5">🌿</span>
          <p className="leading-relaxed">
            No <strong className="text-emerald-950">Grande Vazio Digital</strong>, o ato de projetar exige uma nova responsabilidade: documentar, atestar e honrar as nossas origens e memórias.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-medium animate-shake">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-[11px] uppercase font-mono tracking-wider text-raiz-gray font-medium">
              Nome do Designer / Pesquisador
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Ex. Camila Peixoto"
                className="w-full bg-[#F9FAFB] border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-gray-400 text-raiz-dark text-sm py-3.5 pl-11 pr-4 rounded-xl transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[11px] uppercase font-mono tracking-wider text-raiz-gray font-medium">
              E-mail Corporativo ou Acadêmico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Ex. camila@projeto-raiz.co"
                className="w-full bg-[#F9FAFB] border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-gray-400 text-raiz-dark text-sm py-3.5 pl-11 pr-4 rounded-xl transition-all outline-none"
              />
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-sans font-semibold tracking-wide text-xs uppercase py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-emerald-950/5 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Fazer Login no Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider section */}
        <div className="mt-6 space-y-5">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[9px] font-mono tracking-[0.2em] text-gray-400 uppercase">
              ou avalie rápido
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button
            id="btn-login-seed"
            type="button"
            onClick={() => {
              const session = storeUser('Mariana Vasconcelos', 'mariana.vasco@humantracers.io');
              onLoginSuccess(session);
            }}
            className="w-full bg-[#F8F9FA] hover:bg-emerald-50/40 active:bg-emerald-50/80 border border-gray-200 hover:border-emerald-200 px-4 py-4 flex items-center justify-center gap-3 text-sm text-raiz-dark font-sans transition-all cursor-pointer rounded-xl"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
            <span className="font-semibold text-emerald-900 text-xs tracking-wide">
              Entrar com Portfólio Demonstrativo (Seed)
            </span>
          </button>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-100 text-center flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-mono tracking-widest">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>CONTROLE DE AUTENTICIDADE CRIPTOGRÁFICO LOCAL</span>
        </div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-white/40 font-mono tracking-wider select-none text-center px-4">
        RAIZ &bull; SISTEMA DE PRESERVAÇÃO &bull; BRASÍLIA TERRITÓRIO LIVRE
      </div>
    </div>
  );
}
