import { Container, Typography, Box, Divider, Alert } from '@mui/material';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
      {children}
    </Box>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body2" color="text.secondary" paragraph>
      {children}
    </Typography>
  );
}

export default function LegalPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Legal &amp; Privacy
      </Typography>
      <Typography variant="caption" color="text.disabled">
        Last updated: May 2026
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Alert severity="warning" sx={{ mb: 4 }}>
        <strong>Not legal advice.</strong> Nothing on this platform constitutes legal advice.
        Consult a licensed attorney in your jurisdiction before taking any action based on
        information found here.
      </Alert>

      <Section title="Recording Consent — Know Your State's Laws">
        <P>
          Laws on recording conversations and interactions vary significantly by state. In the
          United States, some states require the consent of all parties before recording audio
          (so-called "all-party" or "two-party" consent states), while others only require the
          consent of one party.
        </P>
        <P>
          Video recording of law enforcement officers performing their duties in public spaces is
          generally protected under the First Amendment in the United States. However, audio
          recording may be subject to additional restrictions depending on your state.
        </P>
        <P>
          <strong>It is your responsibility</strong> to understand and comply with the recording
          laws in your jurisdiction before submitting content to PoliceWatch. PoliceWatch does not
          assume liability for submissions that violate applicable recording laws.
        </P>
        <P>
          <strong>Do not record while operating a vehicle.</strong> If you are the driver, pull
          over safely before recording. Use dashcam footage or have a passenger record.
        </P>
      </Section>

      <Divider sx={{ mb: 4 }} />

      <Section title="Privacy Policy">
        <P>
          <strong>What we collect:</strong> When you submit an incident report, we store the
          video file, GPS coordinates, address, violation type, optional vehicle description,
          timestamp, and your device's approximate speed at the time of recording. We do not
          collect your name, email address, IP address (beyond what Render's infrastructure logs
          temporarily), or any information that identifies you personally.
        </P>
        <P>
          <strong>How it's stored:</strong> Video files are stored on Cloudflare R2 and are
          publicly accessible via direct URL once an incident is published. Incident metadata is
          stored in a Neon (PostgreSQL) database. Published incidents are visible to all users of
          the platform.
        </P>
        <P>
          <strong>Third-party services:</strong> We use Anthropic's Claude API to analyze video
          frames for validation purposes. Frames are sent to Anthropic for processing and are
          subject to Anthropic's privacy policy. We use Nominatim (OpenStreetMap) for reverse
          geocoding of GPS coordinates.
        </P>
        <P>
          <strong>Data retention:</strong> Published incidents are stored indefinitely as a
          community record. Rejected submissions are retained in the database but not publicly
          visible. You may request removal of a specific incident by contacting us.
        </P>
        <P>
          <strong>Cookies:</strong> This platform does not use tracking cookies or analytics.
        </P>
      </Section>

      <Divider sx={{ mb: 4 }} />

      <Section title="Terms of Use">
        <P>By submitting content to PoliceWatch, you agree to the following:</P>
        <P>
          <strong>Accuracy:</strong> You will only submit footage that genuinely depicts a law
          enforcement vehicle committing a traffic violation. Submitting false, fabricated, or
          misleading reports is prohibited.
        </P>
        <P>
          <strong>Authorized subjects:</strong> PoliceWatch is strictly for documenting law
          enforcement traffic violations. Submitting footage of private citizens, non-law
          enforcement vehicles, or content intended to harass specific individuals is prohibited.
        </P>
        <P>
          <strong>No illegal content:</strong> You may not submit content obtained through
          illegal means, including recordings made in violation of applicable wiretapping or
          recording laws.
        </P>
        <P>
          <strong>Public nature:</strong> By submitting, you acknowledge that your video and the
          associated metadata will be publicly visible if confirmed. Do not submit footage that
          reveals your identity or the identity of uninvolved bystanders if you wish to remain
          anonymous.
        </P>
        <P>
          <strong>Platform rights:</strong> PoliceWatch reserves the right to remove any
          submission that violates these terms or that is determined to be false, misleading, or
          obtained illegally, without notice.
        </P>
      </Section>

      <Divider sx={{ mb: 4 }} />

      <Section title="Disclaimer of Liability">
        <P>
          PoliceWatch is provided "as is" without warranty of any kind. The platform makes no
          guarantees about the accuracy, completeness, or reliability of user-submitted content.
          AI validation is a tool to assist moderation — it is not a legal determination of
          wrongdoing.
        </P>
        <P>
          PoliceWatch is not responsible for how submitted evidence is used, shared, or
          interpreted by third parties, including media organizations, legal counsel, or law
          enforcement agencies.
        </P>
      </Section>

      <Typography variant="caption" color="text.disabled">
        For removal requests or questions, open an issue at github.com/sbullocks/policewatch.
      </Typography>
    </Container>
  );
}
