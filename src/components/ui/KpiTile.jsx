export default function KpiTile({ value, label }) {
  return (
    <div className="rounded-3xl bg-gray-50 p-4 text-center">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs uppercase tracking-[.2em] text-gray-500">{label}</p>
    </div>
  )
}
