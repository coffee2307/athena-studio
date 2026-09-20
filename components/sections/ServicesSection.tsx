import { services } from "@/data/services";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export function ServicesSection() {
  return <Section id="services" className="section-services"><div className="section-intro"><p className="eyebrow">What we do</p><Heading>Good work makes<br />complexity feel clear.</Heading></div><div className="service-list">{services.map((service) => <article className="service-row" key={service.number}><span className="mono-label">{service.number}</span><h3 className="heading-3">{service.title}</h3><p className="small service-description">{service.description}</p></article>)}</div></Section>;
}
