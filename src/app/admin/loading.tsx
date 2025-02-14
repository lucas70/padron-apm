import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <FullScreenLoading mensaje={'Cargando...'} />
}
