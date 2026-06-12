export const DEPARTAMENTOS = [
  { value: 'administrativo',       label: 'Administrativo' },
  { value: 'financeiro',           label: 'Financeiro' },
  { value: 'ti',                   label: 'TI' },
  { value: 'rh',                   label: 'RH' },
  { value: 'contabilidade',        label: 'Contabilidade' },
  { value: 'juridico',             label: 'Jurídico' },
  { value: 'graneleiro',           label: 'Graneleiro' },
  { value: 'veterinaria',          label: 'Veterinária' },
  { value: 'transporte',           label: 'Transporte' },
  { value: 'supermercado',         label: 'Supermercado' },
  { value: 'fabrica_racao',        label: 'Fábrica Ração' },
  { value: 'fabrica_nova',         label: 'Fábrica Nova' },
  { value: 'caixas_sup',           label: 'Caixas SUP' },
  { value: 'lancamento_notas_sup', label: 'Lanç. Notas SUP' },
  { value: 'caixas_mat',           label: 'Caixas MAT' },
  { value: 'vendedores_mat',       label: 'Vendedores MAT' },
  { value: 'caixas_vet',           label: 'Caixas VET' },
  { value: 'vendedores_vet',       label: 'Vendedores VET' },
  { value: 'lancamento_notas_vet', label: 'Lanç. Notas VET' },
]

export function getDepartamento(value) {
  return DEPARTAMENTOS.find(d => d.value === value) ?? { value, label: value }
}