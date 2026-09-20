import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Section } from "@/components/ui/Section";

export function Hero() {
  return <Section className="hero"><div className="hero-copy"><p className="eyebrow">Independent digital studio / 2026</p><Heading level={1}>Designing systems,<br />not just websites.</Heading><Text size="large" className="hero-description">Athena designs and builds digital products, websites, and systems for businesses.</Text><div className="hero-actions"><Button href="/contact">Start a project</Button><Button href="/work" variant="outline">View work</Button></div></div><div className="owl-placeholder" aria-label="Reserved space for the future Athena 3D owl visual"><span className="mono-label">Future symbol / 3D owl</span><span className="owl-mark" aria-hidden="true">A</span></div></Section>;
}
