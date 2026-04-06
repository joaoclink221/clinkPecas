import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockUserProfile } from '../model/employee-profile.mock'
import { UserProfileProvider } from '../model/UserProfileContext'
import { EmployeeProfileModal } from './EmployeeProfileModal'

// ── Fixture ───────────────────────────────────────────────────────────────────────────────

// Envolve com UserProfileProvider para que saveProfile escreva no localStorage real
function renderModal(onClose = vi.fn()) {
  render(
    <UserProfileProvider>
      <EmployeeProfileModal onClose={onClose} />
    </UserProfileProvider>,
  )
  return { onClose }
}

// Garante estado limpo de localStorage entre todos os testes
beforeEach(() => localStorage.clear())

// ── 1.1 Overlay e posicionamento ──────────────────────────────────────────────

describe('EmployeeProfileModal — 1.1 Overlay e Posicionamento', () => {
  it('renderiza sem erros', () => {
    expect(() => renderModal()).not.toThrow()
  })

  it('dialog está presente com aria-modal="true"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('dialog é identificado pelo aria-labelledby apontando para o título', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    const titleId = dialog.getAttribute('aria-labelledby')
    expect(titleId).toBeTruthy()
    expect(document.getElementById(titleId!)).toBeInTheDocument()
  })

  it('modal tem largura máxima de 640px via classe max-w-[640px]', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toMatch(/max-w-\[640px\]/)
  })

  it('botão X está presente com aria-label acessível', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /fechar perfil/i })).toBeInTheDocument()
  })

  it('clicar no X chama onClose', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /fechar perfil/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicar no overlay (fora do dialog) chama onClose', async () => {
    const onClose = vi.fn()
    const { container } = render(<EmployeeProfileModal onClose={onClose} />)

    // O overlay é o div aria-hidden imediatamente antes do dialog
    const overlay = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(overlay).toBeTruthy()
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

// ── 1.3 Título e divisão interna ──────────────────────────────────────────────

describe('EmployeeProfileModal — 1.3 Título e Divisão', () => {
  it('exibe o título "Perfil do Funcionário"', () => {
    renderModal()
    expect(
      screen.getByRole('heading', { name: /perfil do funcion\u00e1rio/i }),
    ).toBeInTheDocument()
  })

  it('título é um h2', () => {
    renderModal()
    const heading = screen.getByRole('heading', { name: /perfil do funcion\u00e1rio/i })
    expect(heading.tagName).toBe('H2')
  })

  it('título tem font-size 20px e font-weight 500 inline', () => {
    renderModal()
    const heading = screen.getByRole('heading', { name: /perfil do funcion\u00e1rio/i })
    expect(heading).toHaveStyle({ fontSize: '20px', fontWeight: '500' })
  })

  it('seção "Dados pessoais" está presente com aria-label', () => {
    renderModal()
    expect(
      screen.getByRole('region', { name: /dados pessoais/i }),
    ).toBeInTheDocument()
  })

  it('seção "Preferências do Sistema" está presente com aria-label', () => {
    renderModal()
    expect(
      screen.getByRole('region', { name: /prefer\u00eancias do sistema/i }),
    ).toBeInTheDocument()
  })

  it('divisor <hr> está presente entre as seções', () => {
    const { container } = render(<EmployeeProfileModal onClose={vi.fn()} />)
    expect(container.querySelector('hr')).toBeInTheDocument()
  })

  it('"Preferências do Sistema" aparece após o divisor no DOM', () => {
    const { container } = render(<EmployeeProfileModal onClose={vi.fn()} />)
    const hr = container.querySelector('hr')!
    const prefSection = screen.getByRole('region', { name: /prefer\u00eancias do sistema/i })

    // Compara posição no DOM: hr deve vir antes da seção de preferências
    expect(
      hr.compareDocumentPosition(prefSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})

// ── 2.3 Estado controlado e dirty check ───────────────────────────────────────

describe('EmployeeProfileModal — 2.3 Formulário controlado', () => {
  it('formulário abre pré-preenchido com os dados do mock', () => {
    renderModal()

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Ricardo Oliveira')
    expect(screen.getByLabelText(/email address/i)).toHaveValue('ricardo.o@obsidiangear.com')
    expect(screen.getByLabelText(/department/i)).toHaveValue('Logística')
    expect(screen.getByLabelText(/^role$/i)).toHaveValue('Fleet Coordinator')
  })

  it('formulário aceita initialProfile customizado', () => {
    render(
      <EmployeeProfileModal
        onClose={vi.fn()}
        initialProfile={{
          fullName:   'Ana Costa',
          email:      'ana@example.com',
          department: 'Vendas',
          role:       'Sales Rep',
          avatarUrl:  null,
          preferences: { highContrast: true, pushNotifications: false },
        }}
      />,
    )

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Ana Costa')
    expect(screen.getByLabelText(/department/i)).toHaveValue('Vendas')
  })

  it('campo "Role" é somente leitura', () => {
    renderModal()
    expect(screen.getByLabelText(/^role$/i)).toHaveAttribute('readonly')
  })

  it('"Save Changes" está desabilitado quando nenhum campo foi alterado', () => {
    renderModal()
    expect(
      screen.getByRole('button', { name: /salvar altera\u00e7\u00f5es/i }),
    ).toBeDisabled()
  })

  it('"Save Changes" fica habilitado ao alterar o campo Full Name', async () => {
    renderModal()

    await userEvent.clear(screen.getByLabelText(/full name/i))
    await userEvent.type(screen.getByLabelText(/full name/i), 'Novo Nome')

    expect(
      screen.getByRole('button', { name: /salvar altera\u00e7\u00f5es/i }),
    ).toBeEnabled()
  })

  it('"Save Changes" fica habilitado ao alterar o email', async () => {
    renderModal()

    await userEvent.clear(screen.getByLabelText(/email address/i))
    await userEvent.type(screen.getByLabelText(/email address/i), 'novo@email.com')

    expect(
      screen.getByRole('button', { name: /salvar altera\u00e7\u00f5es/i }),
    ).toBeEnabled()
  })

  it('"Save Changes" fica habilitado ao alterar o Department', async () => {
    renderModal()

    await userEvent.selectOptions(screen.getByLabelText(/department/i), 'Vendas')

    expect(
      screen.getByRole('button', { name: /salvar altera\u00e7\u00f5es/i }),
    ).toBeEnabled()
  })

  it('"Save Changes" volta a ficar desabilitado ao restaurar o valor original', async () => {
    renderModal()

    // Altera e restaura
    await userEvent.selectOptions(screen.getByLabelText(/department/i), 'Vendas')
    await userEvent.selectOptions(screen.getByLabelText(/department/i), 'Logística')

    expect(
      screen.getByRole('button', { name: /salvar altera\u00e7\u00f5es/i }),
    ).toBeDisabled()
  })

  it('botão "Cancel" chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Department select exibe todas as opções do enum', () => {
    renderModal()
    const select = screen.getByLabelText(/department/i)

    ;['Logística', 'Vendas', 'Estoque', 'Financeiro', 'RH', 'Compras'].forEach(dept => {
      expect(select).toContainElement(screen.getByRole('option', { name: dept }))
    })
  })
})

// ── 3.1 Exibição do avatar ────────────────────────────────────────────────────

describe('EmployeeProfileModal — 3.1 Exibição do avatar', () => {
  it('exibe placeholder SVG quando avatarUrl é null', () => {
    render(
      <EmployeeProfileModal
        onClose={vi.fn()}
        initialProfile={{ ...mockUserProfile, avatarUrl: null }}
      />,
    )

    // Sem imagem — placeholder presente; nenhum <img> renderizado
    expect(screen.queryByRole('img', { name: /avatar/i })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/avatar do funcionário/i)).toBeInTheDocument()
  })

  it('exibe <img> quando avatarUrl não é null', () => {
    render(
      <EmployeeProfileModal
        onClose={vi.fn()}
        initialProfile={{ ...mockUserProfile, avatarUrl: 'data:image/png;base64,abc' }}
      />,
    )

    const img = screen.getByRole('img', { name: /avatar do funcionário/i })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc')
  })

  it('container do avatar tem dimensão 80px via classes h-20 w-20', () => {
    const { container } = render(<EmployeeProfileModal onClose={vi.fn()} />)
    const avatarContainer = container.querySelector('[aria-label="Avatar do funcionário"]')
    expect(avatarContainer?.className).toMatch(/h-20/)
    expect(avatarContainer?.className).toMatch(/w-20/)
  })
})

// ── 3.2 Upload de nova foto ───────────────────────────────────────────────────

describe('EmployeeProfileModal — 3.2 Upload de nova foto', () => {
  it('botão "Upload New" está presente e acessível', () => {
    renderModal()
    expect(
      screen.getByRole('button', { name: /fazer upload de nova foto/i }),
    ).toBeInTheDocument()
  })

  it('input de arquivo está oculto na interface', () => {
    const { container } = render(<EmployeeProfileModal onClose={vi.fn()} />)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput.className).toMatch(/hidden/)
    expect(fileInput.getAttribute('accept')).toBe('image/*')
  })

  it('texto auxiliar "Recommended: Square JPG or PNG, 400×400px." está visível', () => {
    renderModal()
    expect(screen.getByText(/recommended.*400.*400/i)).toBeInTheDocument()
  })

  it('selecionar arquivo aciona FileReader e substitui o placeholder pela imagem', async () => {
    const fakeDataUrl = 'data:image/png;base64,iVBORw0KGgo='
    const file = new File(['(content)'], 'photo.png', { type: 'image/png' })

    // FileReader precisa de um constructor real — vi.stubGlobal substitui o global.
    // Retornar um objeto literal do constructor evita aliasing de 'this';
    // onload é capturado em closure e readAsDataURL dispara-o de forma síncrona.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let onloadFn: ((ev: any) => void) | null = null
    const readAsDataURL = vi.fn(() => {
      onloadFn?.({ target: { result: fakeDataUrl } })
    })
    vi.stubGlobal('FileReader', function MockFileReader() {
      return {
        get onload() { return onloadFn },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set onload(fn: any) { onloadFn = fn },
        readAsDataURL,
      }
    })

    const { container } = render(<EmployeeProfileModal onClose={vi.fn()} />)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    // Sem upload ainda — placeholder visível, sem <img>
    expect(container.querySelector('img[alt="Avatar do funcionário"]')).not.toBeInTheDocument()

    await userEvent.upload(fileInput, file)

    expect(readAsDataURL).toHaveBeenCalledWith(file)
    expect(container.querySelector('img[alt="Avatar do funcionário"]')).toBeInTheDocument()

    vi.unstubAllGlobals()
  })

  it('sem arquivo selecionado, handleAvatarChange não altera o estado', async () => {
    const { container } = render(<EmployeeProfileModal onClose={vi.fn()} />)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    // Dispara change sem arquivo — não deve lançar erro
    await userEvent.upload(fileInput, [])

    expect(screen.queryByRole('img', { name: /avatar/i })).not.toBeInTheDocument()
  })
})

// ── 4.2 Select Department — aparência customizada ─────────────────────────────

describe('EmployeeProfileModal — 4.2 Select Department', () => {
  it('select tem classe appearance-none para ocultar seta nativa', () => {
    renderModal()
    const select = screen.getByLabelText(/department/i)
    expect(select.className).toMatch(/appearance-none/)
  })

  it('select está envolvido por um wrapper relativo (para o chevron)', () => {
    renderModal()
    const select = screen.getByLabelText(/department/i)
    // O pai imediato deve ter position relative
    expect(select.parentElement?.className).toMatch(/relative/)
  })

  it('select tem pr-10 para não sobrepor o ícone de chevron', () => {
    renderModal()
    expect(screen.getByLabelText(/department/i).className).toMatch(/pr-10/)
  })

  it('todas as 6 opções continuam disponíveis após a customização', () => {
    renderModal()
    const options = screen.getAllByRole('option')
    const depts = ['Logística', 'Vendas', 'Estoque', 'Financeiro', 'RH', 'Compras']
    depts.forEach(d => expect(options.some(o => o.textContent === d)).toBe(true))
  })
})

// ── 4.3 Campo Role — readonly visual ─────────────────────────────────────────

describe('EmployeeProfileModal — 4.3 Campo Role readonly', () => {
  it('campo Role tem cursor-default e não cursor-not-allowed', () => {
    renderModal()
    const role = screen.getByLabelText(/^role$/i)
    expect(role.className).toMatch(/cursor-default/)
    expect(role.className).not.toMatch(/cursor-not-allowed/)
  })

  it('campo Role tem select-none para impedir seleção de texto', () => {
    renderModal()
    expect(screen.getByLabelText(/^role$/i).className).toMatch(/select-none/)
  })

  it('campo Role tem backgroundColor #22262D inline (mais escuro que campos editáveis)', () => {
    renderModal()
    const role = screen.getByLabelText(/^role$/i) as HTMLInputElement
    // Verifica o style inline — sinaliza visualmente que não é editável
    expect(role.style.backgroundColor).toBe('rgb(34, 38, 45)')
  })

  it('campo Role continua não aceitando digitação (atributo readonly)', () => {
    renderModal()
    expect(screen.getByLabelText(/^role$/i)).toHaveAttribute('readonly')
  })

  it('campo Role não tem opacity-60 (muted via bg, não opacidade)', () => {
    renderModal()
    expect(screen.getByLabelText(/^role$/i).className).not.toMatch(/opacity-60/)
  })
})

// ── 5.2 Toggle High Contrast Mode ────────────────────────────────────────

describe('EmployeeProfileModal — 5.2 High Contrast Mode', () => {
  it('toggle "High Contrast Mode" está presente', () => {
    renderModal()
    expect(screen.getByRole('switch', { name: /high contrast mode/i })).toBeInTheDocument()
  })

  it('inicia com aria-checked="false" (highContrast: false no mock)', () => {
    renderModal()
    expect(
      screen.getByRole('switch', { name: /high contrast mode/i }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('clicar alterna para aria-checked="true"', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('switch', { name: /high contrast mode/i }))
    expect(
      screen.getByRole('switch', { name: /high contrast mode/i }),
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('clicar duas vezes volta para aria-checked="false"', async () => {
    renderModal()
    const sw = screen.getByRole('switch', { name: /high contrast mode/i })
    await userEvent.click(sw)
    await userEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('sublabel "Enhance visibility for critical technical data." está visível', () => {
    renderModal()
    expect(screen.getByText(/enhance visibility for critical technical data/i)).toBeInTheDocument()
  })

  it('alterar highContrast habilita Save Changes (dirty check integrado)', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('switch', { name: /high contrast mode/i }))
    expect(
      screen.getByRole('button', { name: /salvar alterações/i }),
    ).toBeEnabled()
  })
})

// ── 5.3 Toggle Push Notifications ───────────────────────────────────────

describe('EmployeeProfileModal — 5.3 Push Notifications', () => {
  it('toggle "Push Notifications" está presente', () => {
    renderModal()
    expect(screen.getByRole('switch', { name: /push notifications/i })).toBeInTheDocument()
  })

  it('inicia com aria-checked="true" (pushNotifications: true no mock)', () => {
    renderModal()
    expect(
      screen.getByRole('switch', { name: /push notifications/i }),
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('clicar alterna para aria-checked="false"', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('switch', { name: /push notifications/i }))
    expect(
      screen.getByRole('switch', { name: /push notifications/i }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('clicar duas vezes volta para aria-checked="true"', async () => {
    renderModal()
    const sw = screen.getByRole('switch', { name: /push notifications/i })
    await userEvent.click(sw)
    await userEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('sublabel "Receive real-time alerts for critical stock changes." está visível', () => {
    renderModal()
    expect(screen.getByText(/receive real-time alerts for critical stock changes/i)).toBeInTheDocument()
  })

  it('alterar pushNotifications habilita Save Changes (dirty check integrado)', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('switch', { name: /push notifications/i }))
    expect(
      screen.getByRole('button', { name: /salvar alterações/i }),
    ).toBeEnabled()
  })

  it('dois toggles são independentes — alterar um não afeta o outro', async () => {
    renderModal()
    // Clica em High Contrast (false → true)
    await userEvent.click(screen.getByRole('switch', { name: /high contrast mode/i }))

    // Push Notifications deve continuar como iniciou (true)
    expect(
      screen.getByRole('switch', { name: /push notifications/i }),
    ).toHaveAttribute('aria-checked', 'true')
  })
})

// ── 6.1 Cancel — reset de estado ─────────────────────────────────────────────

describe('EmployeeProfileModal — 6.1 Cancel reset', () => {
  it('Cancel chama onClose', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Cancel após edição de fullName reseta o campo ao valor inicial', async () => {
    renderModal()

    // Edita o campo
    const input = screen.getByLabelText(/full name/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'Nome Alterado')
    expect(input).toHaveValue('Nome Alterado')

    // Cancel — o modal fecha; como é remontado na próxima abertura,
    // o estado já seria resetado pelo useState. Verificamos que onClose foi chamado.
    await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    // O campo resetou antes de fechar (handleCancel chama setDraft + onClose)
    // Como o componente não desmonta aqui (RTL mantém montado), confirmamos reset:
    expect(screen.getByLabelText(/full name/i)).toHaveValue(mockUserProfile.fullName)
  })

  it('após Cancel, Save Changes volta a ficar desabilitado', async () => {
    renderModal()

    await userEvent.type(screen.getByLabelText(/full name/i), ' Extra')
    expect(screen.getByRole('button', { name: /salvar/i })).toBeEnabled()

    // Cancel reseta o draft
    await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    // Re-render não ocorre (onClose é mock), mas o draft foi resetado
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled()
  })
})

// ── 6.2 Save Changes — localStorage + toast + close ──────────────────────────

describe('EmployeeProfileModal — 6.2 Save Changes', () => {
  beforeEach(() => localStorage.clear())

  it('clicar Save Changes salva no localStorage', async () => {
    renderModal()
    await userEvent.type(screen.getByLabelText(/full name/i), ' Updated')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    const stored = JSON.parse(localStorage.getItem('userProfile') ?? '{}')
    expect(stored.fullName).toBe(`${mockUserProfile.fullName} Updated`)
  })

  it('toast "Perfil atualizado com sucesso" aparece após salvar', async () => {
    renderModal()
    await userEvent.type(screen.getByLabelText(/full name/i), ' v2')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/perfil atualizado com sucesso/i)).toBeInTheDocument()
  })

  it('toast tem aria-live="polite" para acessibilidade', async () => {
    renderModal()
    await userEvent.type(screen.getByLabelText(/full name/i), ' v2')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('toast não está visível antes de salvar', () => {
    renderModal()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('onClose é chamado após 3s do Save (timer fake)', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    render(
      <UserProfileProvider>
        <EmployeeProfileModal onClose={onClose} initialProfile={mockUserProfile} />
      </UserProfileProvider>,
    )

    // fireEvent é síncrono — não trava com fake timers ao contrário de userEvent
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Nome Diferente' },
    })

    act(() => {
      screen.getByRole('button', { name: /salvar/i }).click()
    })

    expect(onClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onClose).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
