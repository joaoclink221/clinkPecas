import type { Return, WarrantyProtocol } from './warranty.types'

// ── 2.3 Mock de devoluções — 3 registros exatos da imagem ─────────────────────

export const returnsMock: Return[] = [
  {
    id: 'RET-001',
    itemName: 'Disco de Freio Vent.',
    skuRef: 'ORD-98231-X',
    avatarIcon: 'brake',
    reason: 'Avaria no Transporte',
    date: '2023-10-12',
    status: 'analysing',
  },
  {
    id: 'RET-002',
    itemName: 'Alternador 120A',
    skuRef: 'ORD-88122-Y',
    avatarIcon: 'alternator',
    reason: 'Incompatibilidade',
    date: '2023-10-10',
    status: 'approved',
  },
  {
    id: 'RET-003',
    itemName: 'Kit Filtros (4un)',
    skuRef: 'ORD-99100-A',
    avatarIcon: 'filter',
    reason: 'Erro de Pedido',
    date: '2023-10-05',
    status: 'refunded',
  },
]

// ── 2.3 Mock de protocolos de garantia — 2 registros exatos da imagem ─────────

export const warrantyProtocolsMock: WarrantyProtocol[] = [
  {
    protocolId: 'GAR-2290',
    itemName: 'Transmissão Hidráulica X-9',
    description:
      'Ruído excessivo em marcha lenta. Testado em bancada com falha no conversor de torque.',
    openDate: '2023-09-01',
    expirationDate: '2024-09-01',
    linkedOrder: 'ORD-772',
    status: 'in_progress',
  },
  {
    protocolId: 'GAR-2144',
    itemName: 'Módulo de Controle ECU',
    description:
      'Falha de comunicação CAN-bus. Substituído por unidade nova revisada.',
    openDate: '2023-08-15',
    expirationDate: '2024-08-15',
    linkedOrder: 'ORD-551',
    status: 'completed',
  },
]
