# clinkAutoPeças

Sistema de gestão para distribuidoras e oficinas de autopeças — painel administrativo (ERP lite) construído em React + TypeScript + Vite.

## Módulos

| Módulo | Rota | Descrição |
|---|---|---|
| Dashboard | `/` | KPIs, gráficos e feed de atividades recentes |
| Vendas | `/vendas` | Tabela de vendas, filtros, paginação e criação de pedidos |
| Estoque | `/estoque` | Controle de SKUs, alertas críticos e busca |

## Stack

- **React 19** + **TypeScript**
- **Vite** (build e dev server)
- **Tailwind CSS v4** com design tokens customizados
- **React Router DOM v7**
- **Recharts** (gráficos)
- **Vitest** + **React Testing Library** (testes)

## Como rodar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Testes
npm test

# Build de produção
npm run build
```

## Documentação técnica

A documentação completa do projeto está disponível no site Docusaurus em `docs/`.

```bash
# Iniciar o servidor de documentação (http://localhost:3000)
cd docs
npm start
```

A documentação cobre: visão geral, arquitetura, módulo de vendas, módulo de estoque e guia de contribuição.

## Testes

```bash
# Modo watch
npm test

# Execução única
npm run test -- --run
```

**330+ testes** cobrindo todos os componentes, hooks e integrações de página.

## Estrutura do projeto

```
src/
├── app/        # Providers globais
├── features/   # Casos de uso isolados (auth)
├── pages/      # Páginas por módulo (dashboard, inventory, sales)
├── shared/     # UI genérica e utilitários
└── widgets/    # Blocos de layout (Sidebar, Topbar)

docs/           # Site de documentação (Docusaurus)
```
