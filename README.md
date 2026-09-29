# JB Nav Enterprise

A responsive catering and events website built with semantic HTML, CSS and vanilla JavaScript. No framework, build step, or production package dependencies.

## Preview and deploy

Open `index.html` in a modern browser, or serve this folder with any static web server. For GitHub Pages, publish the repository root from your chosen branch. Keep the case-sensitive `Images/` directory alongside `index.html`, `style.css`, and `script.js`.

Typography loads from Google Fonts, with local serif and sans-serif fallbacks. Event photos and the catering inspired logo (`Images/brand-mark.svg`, plus a PNG touch icon) are local. The original logo and reviewer photos are retained in `Images/` but no longer displayed. Reviews use neutral client icons. `Images/hero.jpg` is a 443 KB derivative of the original 4.75 MB `headingbg.jpg`.

## Editing content

- Business details, reviews, services, form options, and gallery entries live in `index.html`.
- Colors, typography, spacing, and responsive layouts are organized in `style.css`.
- Navigation, reveal animations, gallery filtering/lightbox, reviews, and inquiry preparation are in `script.js`.
- Gallery buttons use `data-category`; matching filter buttons use `data-filter`.
- Testimonials and the existing “100+ successful events” statement were preserved from the supplied site. No new customer claims, reviews, prices, or social profiles were added.

## Inquiries

Both forms are frontend-only. They validate the details and create a preview, a prefilled email link to `jinanenterprises@gmail.com`, and a downloadable text copy. Nothing is submitted, stored, or booked automatically. The visitor must send the email in their email application; the download is a fallback if no mail handler is configured or the email link is too long. Form contents are not stored in browser storage.

JavaScript is needed for inquiry preparation. Direct phone and email links remain available. Connect a real form endpoint separately if automatic delivery is desired.

## Social previews

Open Graph and Twitter card metadata are included. Once the public domain is known, replace the relative social image paths with that site's absolute image URL and add `og:url` and a canonical link. No production domain was supplied, so none was invented.

## Verification

The redesign was checked in Chromium at 320, 375, 430, 768, 1024, 1280, 1440, and 1920 pixels. Checks cover document overflow, local images, anchor targets, mobile menu, active navigation, gallery filters and keyboard controls, focus restoration, review controls, both forms, date/email/Philippine-phone validation, inquiry preview, and text download. Reduced-motion behavior and accessibility scans are also checked. Physical-device and email-client behavior can vary.
