import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";

export const metadata = {
  title: "Privacy Policy | Provah",
  description: "How Provah collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 23, 2026">
      <LegalSection heading="1. What we collect">
        <p>When you use Provah, we collect:</p>
        <ul style={{ margin: "8px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Account information: name, email, password (stored hashed, never in plain text), and role (student or professional)</li>
          <li>Profile details you choose to add: university, field of study, company, title, bio, location</li>
          <li>Content you submit: project write-ups, media, and links</li>
          <li>Messages you send to other users through the platform</li>
          <li>Basic usage data: when you log in, which projects you view or save</li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. How we use it">
        <p>
          We use your information to run the platform: creating and authenticating
          your account, showing your profile and projects to other users as
          appropriate for your role, delivering messages between students and
          professionals, and sending account-related emails (confirmation,
          notifications you&apos;ve triggered). We don&apos;t sell your data.
        </p>
      </LegalSection>

      <LegalSection heading="3. Email">
        <p>
          We send transactional email &mdash; account confirmation, password resets,
          and activity notifications &mdash; through Resend, our email delivery
          provider. We don&apos;t send marketing email unless you&apos;ve explicitly
          opted in (for example, by joining the mobile app waitlist).
        </p>
      </LegalSection>

      <LegalSection heading="4. Who can see what">
        <p>
          Your name and role are visible to other users once your account is active.
          Published projects (and the student who submitted them) are visible to
          anyone browsing the platform. Messages are only visible to you and the
          person you&apos;re messaging. Admins can access account and content data to
          moderate the platform and keep it safe.
        </p>
      </LegalSection>

      <LegalSection heading="5. Where your data lives">
        <p>
          Provah&apos;s database and authentication run on Supabase; the application
          itself is hosted on Vercel. Both are reputable infrastructure providers
          with their own security practices. We don&apos;t operate our own servers to
          store your data.
        </p>
      </LegalSection>

      <LegalSection heading="6. Data retention">
        <p>
          We keep your account data for as long as your account is active. If you
          delete your account, we remove your profile and personal information
          within a reasonable period, though some records may be retained where
          required for legal or security reasons.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your rights">
        <p>
          You can review and update most of your profile information directly from
          your account settings. To request a copy of your data, or to request
          deletion of your account, email{" "}
          <a href="mailto:hello@provah.live" style={{ color: "#6C4CE0" }}>
            hello@provah.live
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="8. Children's privacy">
        <p>
          Provah is built for final-year university students and working
          professionals. It isn&apos;t intended for children under 16, and we
          don&apos;t knowingly collect data from them.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to this policy">
        <p>
          We may update this policy as the platform evolves. If we make a material
          change, we&apos;ll update the date at the top of this page.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact">
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:hello@provah.live" style={{ color: "#6C4CE0" }}>
            hello@provah.live
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
