import { AUTH_CONFIG } from '@/config/authConfig';

export function AuthSplitLayout({ brandPanel, children, company = AUTH_CONFIG, wide = false, exiting = false }) {
  return (
    <main className="auth-layout">
      <section className="auth-layout__brand">{brandPanel}</section>
      <section className="auth-layout__content">
        <div className="auth-layout__mobile-brand" aria-label={company.companyName}>
          <span>{company.companyInitial}</span>
          <strong>{company.companyName}</strong>
        </div>
        <div className={`auth-layout__form${wide ? ' auth-layout__form--wide' : ''}${exiting ? ' auth-layout__form--exiting' : ''}`}>{children}</div>
      </section>
    </main>
  );
}
