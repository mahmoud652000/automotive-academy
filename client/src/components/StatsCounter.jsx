import { useState, useEffect, useRef } from 'react'

export default function StatsCounter({ stats }) {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const durations = 2000
    const steps = 60
    const interval = durations / steps

    stats.forEach((stat, index) => {
      const increment = stat.value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= stat.value) {
          current = stat.value
          clearInterval(timer)
        }
        setCounts((prev) => {
          const next = [...prev]
          next[index] = Math.floor(current)
          return next
        })
      }, interval)
    })
  }, [visible, stats])

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {counts[index].toLocaleString('ar-EG')}{stat.suffix}
          </div>
          <p className="text-muted text-sm md:text-base">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
