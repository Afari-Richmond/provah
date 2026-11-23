import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";

export const metadata = {
  title: "Terms of Service | Provah",
  description: "The terms that govern using Provah.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 23, 2026">
      <LegalSection heading="1. Acceptance of these terms">
        <p>
          By creating an account or otherwise using Provah, you agree to these Terms
          of Service. If you don&apos;t agree, don&apos;t use the platform.
        </p>
      </LegalSection>

      <LegalSection heading="2. What Provah is">
        <p>
          Provah is a free platform where final-year students can submit capstone
          projects and industry professionals, mentors, and investors can discover
          them and reach out directly. We don&apos;t charge fees, take commissions, or
          act as a broker to any agreement you reach with another user.
        </p>
      </LegalSection>

      <LegalSection heading="3. Accounts">
        <p>
          You need an account to submit a project, message other users, or save
          projects. You&apos;re responsible for keeping your login credentials secure
          and for anything that happens under your account. You must provide accurate
          information when you sign up, including your role (student or
          professional) &mdash; we review submissions and may suspend accounts that
          misrepresent who they are.
        </p>
      </LegalSection>

      <LegalSection heading="4. Your content">
        <p>
          When you submit a project &mdash; write-ups, media, links, or any other
          material &mdash; you keep ownership of it. You grant Provah a
          non-exclusive, royalty-free license to host, display, and distribute that
          content on the platform so other users can discover it. You&apos;re
          responsible for making sure you have the right to share what you submit,
          and for not submitting anything that infringes someone else&apos;s rights.
        </p>
        <p>
          We review project submissions before they&apos;re listed, but we don&apos;t
          guarantee any submission will be published, and we can remove content that
          violates these terms.
        </p>
      </LegalSection>

      <LegalSection heading="5. Acceptable use">
        <p>You agree not to:</p>
        <ul style={{ margin: "8px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Impersonate another person or misrepresent your affiliation with any organization</li>
          <li>Use messaging to send spam, scams, or unsolicited commercial pitches</li>
          <li>Scrape, copy, or redistribute project data in bulk without permission</li>
          <li>Upload malware or attempt to disrupt the platform&apos;s operation</li>
          <li>Use the platform for anything illegal under the laws that apply to you</li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Free of charge">
        <p>
          Provah does not charge students or professionals to use the platform, and
          we do not take a cut of any funding, employment, or mentorship arrangement
          that results from a connection made here. If that ever changes for a
          specific paid feature, we&apos;ll be explicit about it before you pay
          anything.
        </p>
      </LegalSection>

      <LegalSection heading="7. Termination">
        <p>
          You can delete your account at any time. We can suspend or terminate
          accounts that violate these terms, misuse the platform, or create risk for
          other users.
        </p>
      </LegalSection>

      <LegalSection heading="8. Disclaimers and liability">
        <p>
          Provah is provided &ldquo;as is.&rdquo; We don&apos;t guarantee that any
          project will be seen by a professional, that any professional is who they
          claim to be beyond our verification checks, or that any outcome will
          result from using the platform. To the extent permitted by law, Provah
          isn&apos;t liable for indirect or consequential damages arising from your
          use of the service.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to these terms">
        <p>
          We may update these terms as the platform evolves. If we make a material
          change, we&apos;ll update the date at the top of this page.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:hello@provah.live" style={{ color: "#6C4CE0" }}>
            hello@provah.live
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
