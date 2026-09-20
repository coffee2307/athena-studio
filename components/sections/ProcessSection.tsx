import { process } from "@/data/process";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export function ProcessSection() {
  return <Section id="process" tone="inverse" className="section-process"><div className="section-intro"><p className="eyebrow">How we work</p><Heading>Thoughtful from<br />first question to launch.</Heading></div><div className="process-list">{process.map((step) => <article className="process-row" key={step.number}><span className="mono-label">{step.number}</span><div><h3 className="heading-3">{step.title}</h3><p className="small process-description">{step.description}</p></div></article>)}</div></Section>;
}
