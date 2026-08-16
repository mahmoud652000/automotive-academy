export default function Logo({ className = 'w-12 h-12', showText = true }) {
  return (
    <img
      src="/logo.png"
      alt="Automotive Academy"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
