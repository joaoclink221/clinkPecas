import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'clinkAutoPeças',
  tagline: 'Documentação técnica do sistema de gestão para autopeças',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://clink-autopecas.example.com',
  baseUrl: '/',

  organizationName: 'clinkPecas',
  projectName: 'clinkAutoPecas',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'clinkAutoPeças',
      logo: {
        alt: 'clinkAutoPeças Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documentação',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Módulos',
          items: [
            { label: 'Visão Geral', to: '/docs/intro' },
            { label: 'Vendas', to: '/docs/modulos/vendas' },
            { label: 'Estoque', to: '/docs/modulos/estoque' },
          ],
        },
        {
          title: 'Desenvolvimento',
          items: [
            { label: 'Arquitetura', to: '/docs/arquitetura' },
            { label: 'Como Contribuir', to: '/docs/contribuindo' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} clinkAutoPeças. Documentação construída com Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
