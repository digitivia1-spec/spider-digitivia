import './Toast.css'

export function Toast({ visible, message }: { visible: boolean; message: string }) {
  return (
    <div className="toast" data-visible={visible} role="status" aria-live="polite">
      {message}
    </div>
  )
}
