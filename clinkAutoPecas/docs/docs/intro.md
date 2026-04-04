---
sidebar_position: 1
title: Visão Geral
---

# clinkAutoPeças — Visão Geral

Sistema de gestão para oficinas e distribuidoras de autopeças, desenvolvido em React + TypeScript + Vite.

## O que é o clinkAutoPeças?

O **clinkAutoPeças** é um painel administrativo (ERP lite) que centraliza as operações diárias de uma distribuidora de peças automotivas. Ele oferece:

- **Dashboard** com indicadores em tempo real de vendas, estoque e movimentações.
- **Módulo de Vendas** com tabela, filtros, paginação, modal de criação e KPIs.
- **Módulo de Estoque** com controle de SKUs, alertas críticos, busca e paginação.

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS v4 (design tokens via CSS custom properties) |
| Gráficos | Recharts |
| Rotas | React Router DOM v7 |
| Testes | Vitest + React Testing Library |
| Linting | ESLint + typescript-eslint |

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Rodar os testes
npm test

# Build de produção
npm run build
```

O servidor de desenvolvimento estará disponível em `http://localhost:5173`.

## Estrutura de pastas

```
src/
├── app/           # Providers e configuração global
├── features/      # Funcionalidades isoladas (ex: auth/login)
├── pages/         # Páginas da aplicação por módulo
│   ├── dashboard/
│   ├── inventory/
│   └── sales/
├── shared/        # Componentes e utilitários reutilizáveis
│   ├── constants/
│   └── ui/
└── widgets/       # Componentes de layout (Sidebar, Topbar)
```

## Rotas disponíveis

| Rota | Módulo |
|---|---|
| `/` | Dashboard |
| `/vendas` | Módulo de Vendas |
| `/estoque` | Módulo de Estoque |
