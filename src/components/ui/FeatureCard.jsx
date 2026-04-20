import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function FeatureCard({ titleKey, descKey, icon, color, path }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="feature-card cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange focus-visible:ring-offset-2"
      aria-label={t(titleKey)}
    >
      <div className="h-1.5 w-full" style={{ background: color }} />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div
          className="w-14 h-14 rounded-[14px] flex items-center justify-center"
          style={{ background: color }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <h3 className="font-medium text-gray-900 text-[15px]">{t(titleKey)}</h3>
        <p className="text-sm text-gray-500 flex-1">{t(descKey)}</p>
        <div className="flex items-center gap-1.5 mt-1" style={{ color }}>
          <span className="text-sm font-medium">{t('features.explore')}</span>
          <span
            className="w-3.5 h-3.5 rounded-[3px]"
            style={{ background: color }}
            aria-hidden="true"
          />
        </div>
      </div>
    </button>
  )
}
