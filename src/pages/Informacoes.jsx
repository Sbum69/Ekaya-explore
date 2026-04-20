import { useTranslation } from 'react-i18next'

export default function Informacoes() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="mx-4 mt-6 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-gradient-to-r from-ekaya-orange to-orange-200 p-6 text-white">
          <h1 className="text-2xl font-semibold">{t('features.information.title')}</h1>
          <p className="mt-2 text-sm text-white/80">{t('pages.information.subtitle')}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-3xl border border-gray-100 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pages.information.tip_title')}
            </h2>
            <p className="text-sm text-gray-600 mt-2">{t('pages.information.tip_text')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('pages.information.support_title')}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{t('pages.information.support_text')}</p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('pages.information.transport_title')}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{t('pages.information.transport_text')}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('pages.information.resource_title')}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{t('pages.information.resource_text')}</p>
          </div>

          <div className="rounded-3xl bg-gray-50 p-5">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('pages.information.quick_tips_title')}
            </h3>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>{t('pages.information.quick_tip1')}</li>
              <li>{t('pages.information.quick_tip2')}</li>
              <li>{t('pages.information.quick_tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
