import React, { useState } from 'react';
import { UserSession } from '../types';
import { storeUser } from '../utils';

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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-raiz-border p-8 md:p-10 shadow-sm relative">
        {/* Aesthetic design element mimicking a catalog label or archive marker */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-raiz-green"></div>
        <div className="absolute -top-3 right-6 bg-raiz-bg px-2 text-[10px] uppercase font-mono tracking-widest text-raiz-gray border border-raiz-border">
          Ficha #001 // Acesso
        </div>

        <div className="text-center mb-8">
          <span className="font-serif italic text-4xl font-semibold text-raiz-green tracking-tight">
            RAIZ
          </span>
          <p className="mt-3 text-xs uppercase font-mono tracking-widest text-raiz-gray">
            Preservação de Contexto Cultural
          </p>
        </div>

        {/* Narrative context box for Design Futures "O Grande Vazio Digital" */}
        <div className="mb-8 p-4 bg-raiz-bg border-l-2 border-raiz-terracotta text-xs leading-relaxed text-raiz-dark/80 font-serif italic">
          &ldquo;No futuro do Grande Vazio Digital, onde conteúdos criados por IA homogeneizaram a estética mundial, o ato de projetar exige uma nova responsabilidade: documentar, atestar e honrar as nossas origens e memórias humanas legítimas.&rdquo;
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-2">
              Nome do Designer / Pesquisador
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Ex. Camila Peixoto"
              className="w-full bg-raiz-bg border border-raiz-border px-4 py-3 text-sm focus:outline-none focus:border-raiz-green transition-colors text-raiz-dark"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase font-mono tracking-wider text-raiz-gray mb-2">
              Endereço de E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Ex. camila@projeto-raiz.co"
              className="w-full bg-raiz-bg border border-raiz-border px-4 py-3 text-sm focus:outline-none focus:border-raiz-green transition-colors text-raiz-dark"
            />
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className="w-full bg-raiz-green hover:bg-raiz-green/90 text-white font-sans uppercase font-medium tracking-wider text-xs py-3.5 transition-colors cursor-pointer"
          >
            Fazer Login na Plataforma
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-raiz-border text-center">
          <p className="text-[10px] text-raiz-gray font-mono">
            RAIZ // PLATAFORMA DE SALVAGUARDA ESTÉTICA
          </p>
        </div>
      </div>
    </div>
  );
}
