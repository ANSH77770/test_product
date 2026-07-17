import { AUTH_CONFIG, BRAND_FEATURES } from '@/config/authConfig';

export function BrandPanel({ config = AUTH_CONFIG, features = BRAND_FEATURES }) {
  return (
    <div className="brand-panel">
      <header className="brand-lockup">
        <div className="brand-logo" aria-hidden="true">{config.companyInitial}</div>
        <div>
          <div className="brand-name">{config.companyName}</div>
          <div className="brand-subtitle">{config.productSubtitle}</div>
        </div>
      </header>

      <div className="brand-message">
        <span className="phase-badge">{config.planningPhase}</span>
        <h1>{config.brandHeadline}</h1>
        <ul className="feature-list">
          {features.map((feature) => (
            <li key={feature.title}>
              <strong>{feature.title}</strong> — {feature.detail}
            </li>
          ))}
        </ul>
      </div>

      <footer>{config.footerText}</footer>
    </div>
  );
}
