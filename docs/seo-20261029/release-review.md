# ADR Carriers competitive SEO development candidate — 29 October 2026

**Status: development review only; blocked for production release.** No deployment, DNS change, cross-domain redirect, live form submission or database change is authorised or performed. This report distinguishes tested SEO work from the unavailable exact production baseline.

## Source and deployment identity

Authenticated Vercel inspection of `adrcarriers.com` returned production deployment `dpl_B4hopTZJGPZEMx4TqvfN67zSPpgt`, hostname `adr-nwv0sqb44-haulsmart.vercel.app`, project `prj_63KruBvhNeD4K5phS3WQFTqQw22F` (`adr`), team `team_4s3slf7RDwc6sdOHUHIp2NoJ` (Haulsmart). It is READY, target production, source CLI. Its aliases include `adrcarriers.com`, `adr-mu.vercel.app` and `adr-haulsmart.vercel.app`.

Deployment metadata identifies GitHub `Haulsmart1/adr`, local branch `stu-development`, commit `603e019e8f16f208d488894db8e51403a9ac25ba`, message `release: prepare verified ADR public site`. This is **not a Git-linked deployment proving that GitHub main equals production**. Both a direct Git fetch and authenticated GitHub commit lookup failed for that SHA. GitHub main is `0e43bcc17eeb6e02e99b352d20c1e17e76a0f5ee`. The deployment’s uploaded source reports the same historical main as its local ancestor, but its release commit was not pushed. Repository association is corroborated by the deployed file tree and source documents, not inferred from its name. `haulsmarteuro` was not substituted for the website.

Production source retrieval recovered several small shared files exactly, including layout, navigation, footer, global styles, JSON-LD serializer and route metadata helper. Vercel’s connector truncates deep directory entries and large base64 file responses, so a complete source snapshot could not be recovered. Public rendered HTML was fetched separately. The deployed package reports Next 15.5.27 and React 19.0.8; GitHub main still uses Next 14.1.0 and React 18.2.0. Main also has different operational/admin/employment code and old commercial claims. **Do not deploy this branch as a replacement for production or merge it straight into a production release.** Recover the local `stu-development` release source and apply/reconcile the reviewed SEO changes there, preserving the deployed enquiry and operational code. Framework/security reconciliation and complete regression testing are release gates.

Development branch: `development/competitive-seo-20261029`, based on the accessible GitHub main. The draft PR is an integration candidate. `vercel.json` disables Git-triggered deployments specifically for this branch; other branch settings are not changed. There are no tracked GitHub Actions workflows on the inspected main. No CLI deployment is run. No live hosting settings are changed.

## Implemented commercial changes

- Replaced the weak historical homepage with dedicated dangerous-goods road transport positioning, UK/Europe/Ireland journeys, Class 1/Class 7/lithium service links, a practical four-part enquiry prompt, direct phone/email details and repeated quotation actions.
- Retained existing core service URLs. Nine distinct transport guides cover ten requested intents: dangerous goods courier UK and dedicated ADR share one page; lithium, UN3480/UN3481, damaged/defective batteries, Class 1, Class 7, Europe, Ireland and time-critical movements each have specific guidance. This avoids competing near-duplicate keyword pages.
- Added 18 service FAQs plus homepage questions. Content addresses classification, configuration, condition, quantity, package information, ferry acceptance, customs responsibilities and delivery timing. No blanket collection, certification or acceptance promise is introduced.
- Added Cumbria enquiry content tied to the company’s published Newton Arlosh/Wigton contact address. It explicitly does not advertise a depot, storage facility or public drop-off point. No unsupported Manchester, Birmingham, London or Heathrow landing page is published.
- Improved quote requirements and fallback phone/email contact. Added form-label associations, autofill hints, announced status messages, optional telephone input matching the live form’s visible requirement, and rejection handling when a provider returns HTTP 200 with `success:false`. The historic branch’s recipient and submission URL are unchanged. These client changes must be reconciled with the newer production form before release.
- Reused exact recovered public layout/navigation foundations, with added visible telephone access and specialist footer links. Fixed a broken cookie-information link and storage-unavailable handling without introducing analytics.
- Added explicit canonicals to public pages, noindex directives for admin/auth/completion routes, a public-route sitemap allowlist, safe JSON-LD serialization, Organization/WebSite schema and relevant service/breadcrumb schema. No invented ratings, reviews, offices or certifications enter structured data. FAQ rich-result eligibility is not claimed.
- New homepage and guides use server-rendered text, system fonts and no heavy decorative images. Quote/contact pages no longer load large background photographs. Existing unrelated images remain outside this focused patch and need review against the recovered production source.
- Corrected two policy document links to files actually present in the repository. Existing public URLs are preserved. The obsolete sitemap shard is removed; release integration must preserve production’s existing `/sitemap-0.xml` → `/sitemap.xml` redirect (already observed in the uploaded production configuration). No `.co.uk` redirect is implemented.

## Content evidence and approvals

Public company pages substantiate the displayed company name, telephone, email, published contact address and the existence of the service enquiry categories. These are first-party published facts, not independent certification verification. See `content-evidence-and-approvals.md`. No independent authorisation certificates, DGSA/RPA appointment evidence, fleet documents, customer permissions or operational case records were supplied. No customer case study, review, client name, fleet approval, membership status, all-class acceptance or company-history claim is invented. Historic claims remain in unrelated GitHub-main pages and must not be treated as verified because they pre-exist; reconcile those pages with the safer live content before release.

Stuart and the appropriate dangerous-goods adviser should review the final service scope and regulatory guidance before publication. Damaged/defective batteries remain an assessment enquiry, not an advertised blanket acceptance capability. No authorisation to transport every Class 1 or Class 7 consignment is implied.

## Verification scope

The local production build runs without live credentials. Browser verification is restricted to localhost and blocks external browser requests. Quote tests intercept all submissions and never send a message. Employment is deliberately excluded because historic main reads application records rather than representing the deployed public careers page; no real database is connected. Authenticated admin, database writes, recruitment uploads, live mail delivery and provider-side acceptance cannot be certified from this baseline. Do not use the build result as evidence of those flows.

See `results/verification-summary.md` and raw reports for final results, limitations and reproduction commands. Rankings, impressions and clicks are **unverified**: Google Search Console was not available. Lighthouse is a synthetic local measurement, not field Core Web Vitals or a ranking forecast.

## Commercial opportunities and measurement

1. Capture qualified dedicated ADR enquiries with classification, route and timing supplied earlier, reducing clarification before quoting.
2. Offer a more useful battery journey through lithium → UN configuration → damaged/defective assessment, with no unsupported acceptance claim.
3. Serve UK–Europe and Ireland intent with explicit route/crossing/customs questions.
4. Make urgent enquiries actionable through actual readiness and deadline information instead of an unverified same-day promise.
5. Consolidate the two live domains only after the URL-by-URL content review and Stuart’s explicit approval. Preserve useful `.co.uk` material and avoid redirecting unrelated pages to the homepage.

After an approved release, record the release date and annotation, verify indexing and declared/selected canonicals in Search Console, submit the correct sitemap, and review non-brand query/page groups at 28/56/90 days. Track qualified phone/form enquiries, quote completeness and accepted bookings separately from traffic. Do not send shipment contents, security information or personal data to analytics. Establish baselines before attributing gains; no numeric uplift or rankings are promised.

Mobile visual review also found that the inherited fixed cookie-information notice obscured the hero quotation action on a fresh visit. It is now an inline, dismissible privacy-information notice at the foot of the page, with a descriptive policy link. No non-essential tracking is added or enabled. This is not a substitute for a consent platform if non-essential cookies are introduced later.

Further read-only production-source inspection confirmed that the deployed quote form already uses `validateEnquiry`, a duplicate-submit ref guard and a 20-second request timeout, with the same FormSubmit endpoint and recipient. The small validation module was recovered completely and reused; the known safeguards were retained in the candidate form. Full production-source recovery remains necessary because the rest of the uploaded form and operational tree are still not available as a complete, exact baseline.
