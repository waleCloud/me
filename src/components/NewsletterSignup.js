import * as React from "react"

const BEEHIIV_ATTRIBUTION_SCRIPT =
  "https://subscribe-forms.beehiiv.com/attribution.js"
const BEEHIIV_FORM_SCRIPT = "https://subscribe-forms.beehiiv.com/v3/loader.js"
const BEEHIIV_FORM_ID = "a50b3125-1371-463d-891a-46523552421c"
const ATTRIBUTION_SCRIPT_ID = "beehiiv-attribution"

const NewsletterSignup = ({ compact = false }) => {
  const formContainer = React.useRef(null)
  const [formLoaded, setFormLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!document.getElementById(ATTRIBUTION_SCRIPT_ID)) {
      const attributionScript = document.createElement("script")
      attributionScript.id = ATTRIBUTION_SCRIPT_ID
      attributionScript.async = true
      attributionScript.src = BEEHIIV_ATTRIBUTION_SCRIPT
      document.body.appendChild(attributionScript)
    }

    const container = formContainer.current
    if (!container) return undefined

    const loaderScript = document.createElement("script")
    loaderScript.async = true
    loaderScript.src = BEEHIIV_FORM_SCRIPT
    loaderScript.dataset.beehiivForm = BEEHIIV_FORM_ID

    const observer = new MutationObserver(() => {
      const hasRenderedForm = Array.from(container.children).some(
        child =>
          child !== loaderScript &&
          !child.classList.contains("newsletter-form-loading")
      )

      if (hasRenderedForm) setFormLoaded(true)
    })

    observer.observe(container, { childList: true, subtree: true })
    container.appendChild(loaderScript)

    return () => {
      observer.disconnect()
      if (container.contains(loaderScript)) container.removeChild(loaderScript)
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
        className="newsletter-form"
        data-newsletter-form={BEEHIIV_FORM_ID}
        ref={formContainer}
      >
        {!formLoaded && (
          <span className="newsletter-form-loading" aria-live="polite">
            Loading subscription form…
          </span>
        )}
      </div>
    </aside>
  )
}

export { BEEHIIV_FORM_ID }
export default NewsletterSignup
