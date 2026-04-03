export type ModulePlaceholderPageProps = {
  title: string
}

export function ModulePlaceholderPage({ title }: ModulePlaceholderPageProps) {
  return (
    <div>
      <h1 className="text-headline-sm font-semibold text-on-surface">{title}</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">Módulo em construção.</p>
    </div>
  )
}
