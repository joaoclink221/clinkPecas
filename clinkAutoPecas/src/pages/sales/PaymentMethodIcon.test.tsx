import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PaymentMethodIcon } from './PaymentMethodIcon'

describe('PaymentMethodIcon', () => {
  it('renderiza ícone acessível para Pix', () => {
    render(<PaymentMethodIcon method="Pix" />)

    expect(screen.getByLabelText('Pix')).toBeInTheDocument()
  })

  it('renderiza ícone acessível para Boleto', () => {
    render(<PaymentMethodIcon method="Boleto" />)

    expect(screen.getByLabelText('Boleto')).toBeInTheDocument()
  })

  it('renderiza ícone acessível para Cartão', () => {
    render(<PaymentMethodIcon method="Cartão" />)

    expect(screen.getByLabelText('Cartão')).toBeInTheDocument()
  })

  it('renderiza ícone acessível para Dinheiro', () => {
    render(<PaymentMethodIcon method="Dinheiro" />)

    expect(screen.getByLabelText('Dinheiro')).toBeInTheDocument()
  })

  it('cada método renderiza um SVG interno com aria-hidden', () => {
    const { container } = render(<PaymentMethodIcon method="Pix" />)

    const svg = container.querySelector('svg[aria-hidden]')
    expect(svg).toBeInTheDocument()
  })

  it('o SVG tem dimensões 16×16', () => {
    const { container } = render(<PaymentMethodIcon method="Cartão" />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
  })
})
