import { useState, useEffect } from 'react'
import Icons from './Icons'

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  return { toast, showToast }
}

export default function Toast({ toast }) {
  if (!toast) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] animate-fadeIn w-[90%] max-w-md">
      <div className={`px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${
        toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}>
        {toast.type === 'success' ? <Icons.CheckCircle className="w-4 h-4" /> : <Icons.Shield className="w-4 h-4" />}
        {toast.msg}
      </div>
    </div>
  )
}
