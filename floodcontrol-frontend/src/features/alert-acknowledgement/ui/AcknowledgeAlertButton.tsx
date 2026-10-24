import { Button } from '../../../shared/ui/Button'

export function AcknowledgeAlertButton({ onAcknowledge }: { onAcknowledge: () => void }) {
  return <Button onClick={onAcknowledge} className="mt-3 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-400">Acknowledge</Button>
}
