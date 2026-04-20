export default function StatCard({ icon, value, label, gradient }) {
  return (
    <div className="stat-card">
      <div
        className="w-12 h-12 rounded-[13px] flex items-center justify-center"
        style={{ background: gradient }}
      >
        {icon}
      </div>
      <span className="text-[28px] font-medium text-gray-900 leading-none">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}
