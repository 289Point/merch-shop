import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";
import { INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/social";

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-section">
          <span className="site-footer-heading">289Point Showroom</span>
          <p className="site-footer-text">
            Il merchandising ufficiale di Pallacanestro Budrio.
          </p>
        </div>

        <div className="site-footer-section">
          <span className="site-footer-heading">Contatti</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="site-footer-link">
            {CONTACT_EMAIL}
          </a>
          
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-link"
          >
            WhatsApp
          </a>
        </div>

        {(INSTAGRAM_URL || FACEBOOK_URL) && (
          <div className="site-footer-section">
            <span className="site-footer-heading">Seguici</span>
            {INSTAGRAM_URL && (
              
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-link"
              >
                Instagram
              </a>
            )}
            {FACEBOOK_URL && (
              
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-link"
              >
                Facebook
              </a>
            )}
          </div>
        )}
      </div>
      <div className="site-footer-bottom">
        © {year} 289Point Showroom
      </div>
    </footer>
  );
}
