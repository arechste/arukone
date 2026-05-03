import { APP_VERSION, BUILD_SHA, RELEASE_URL } from '../lib/version';

export function Footer() {
  return (
    <footer className="footer">
      <a
        className="footer__version"
        href={RELEASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={`build ${BUILD_SHA} · open source, no accounts, no ads, no tracking. Generator under AGPL-3.0; everything else MIT.`}
      >
        v{APP_VERSION}
      </a>
    </footer>
  );
}
