export const TIPOS = [
  { value: 'computador',  label: 'Computador',  cor: '#818cf8' },
  { value: 'impressora',  label: 'Impressora',  cor: '#22d3ee' },
  { value: 'antena_wifi', label: 'Antena WiFi', cor: '#4ade80' },
  { value: 'nvd',         label: 'NVD',         cor: '#fb923c' },
  { value: 'camera',      label: 'Câmera',      cor: '#c084fc' },
  { value: 'servidor',    label: 'Servidor',    cor: '#f472b6' },
]

export function getTipo(value) {
  return TIPOS.find(t => t.value === value) ?? { value, label: value, cor: '#64748b' }
}
