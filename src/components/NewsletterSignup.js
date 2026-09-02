import * as React from "react"

const BEEHIIV_ATTRIBUTION_SCRIPT =
  "https://subscribe-forms.beehiiv.com/attribution.js"
const BEEHIIV_FORM_ID = "a50b3125-1371-463d-891a-46523552421c"
const BEEHIIV_FORM_URL = `https://subscribe-forms.beehiiv.com/v3/forms/${BEEHIIV_FORM_ID}?layout=slim`
const ATTRIBUTION_SCRIPT_ID = "beehiiv-attribution"

const NewsletterSignup = ({ compact = false }) => {
  const [formLoaded, setFormLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!document.getElementById(ATTRIBUTION_SCRIPT_ID)) {
      const attributionScript = document.createElement("script")
      attributionScript.id = ATTRIBUTION_SCRIPT_ID
      attributionScript.async = true
      attributionScript.src = BEEHIIV_ATTRIBUTION_SCRIPT
      document.body.appendChild(attributionScript)
    }
  }, [])

  return (
    <aside
      className={`newsletter-signup${
        compact ? ` newsletter-signup-compact` : ``
      }`}
      aria-labelledby={
        compact ? `post-newsletter-heading` : `newsletter-heading`
      }
    >
      <div className="newsletter-copy">
        <p className="newsletter-label">Walecloud newsletter</p>
        <h2 id={compact ? `post-newsletter-heading` : `newsletter-heading`}>
          Engineering judgement, delivered.
        </h2>
        <p>
          Engineering judgement, leadership lessons, and practical insights from
          building software, AI systems, and teams at scale.
        </p>
      </div>
      <div
        className={`newsletter-form${
          formLoaded ? ` newsletter-form-loaded` : ``
        }`}
        data-newsletter-form={BEEHIIV_FORM_ID}
      >
        {!formLoaded && (
          <p className="newsletter-form-loading" aria-live="polite">
            Loading subscription form… If it does not appear, {` `}
            <a
              href={BEEHIIV_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              open the signup form
            </a>
            .
          </p>
        )}
        <iframe
          className="newsletter-form-frame"
          src={BEEHIIV_FORM_URL}
          title="Subscribe to the Walecloud newsletter"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setFormLoaded(true)}
        />
      </div>
    </aside>
  )
}

export { BEEHIIV_FORM_ID, BEEHIIV_FORM_URL }
export default NewsletterSignup
