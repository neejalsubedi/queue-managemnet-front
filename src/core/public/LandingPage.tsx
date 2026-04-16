import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Clock,
  Users,
  CalendarCheck,
  ArrowRight,
  Stethoscope,
  Target,
  Eye,
  Shield,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Clock,
    title: "Flexible Hours",
    description:
      "We're open when you need us. Extended hours and weekend appointments available.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Our doctors and staff are dedicated to providing quality care for you and your family.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Book appointments online in minutes. Manage your visits from your account.",
  },
];

const values = [
  {
    icon: Target,
    title: "Our mission",
    description:
      "To provide accessible, compassionate, and high-quality healthcare to every patient who walks through our doors.",
  },
  {
    icon: Eye,
    title: "Our vision",
    description:
      "To be the trusted neighborhood clinic where families receive consistent care and support for all stages of life.",
  },
  {
    icon: Shield,
    title: "Our values",
    description:
      "Integrity, respect, and patient-first care guide everything we do. Your wellbeing is at the center of our practice.",
  },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "Chabahil, Kathmandu ",
    sub: "Chabahil Plaza, 2nd Floor",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "01452365",
    sub: "Sun–Sat, 8 AM – 6 PM",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@careclinic.gmail.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Sun – Fri: 8:00 AM – 6:00 PM",
    sub: "Sat: 9:00 AM – 2:00 PM",
  },
];

export const heroContent = {
  title: "Quality Healthcare Made Simple & Accessible",
  description:
    "CareClinic provides modern, reliable, and patient-centered healthcare services. Book appointments, manage records, and connect with doctors easily — all in one place.",

  phoneNumber: "01-452365",

  primaryCtaText: "Create Account & Book Appointment",
  primaryCtaLink: "/signup",
};

const DEFAULT_HERO_IMAGE = "/hero-clinic-professional.png";
const FALLBACK_HERO_IMAGE = "/placeholder.svg";
const LandingPage = () => {
  const [imgError, setImgError] = useState(false);
  const heroImage = (imgError ? FALLBACK_HERO_IMAGE : DEFAULT_HERO_IMAGE);
  return (
    <>
      {/* Hero */}
      <section
        id="hero"
        className="relative h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            role="presentation"
            className="w-full h-full object-cover object-top-right"
            onError={() => setImgError(true)}
          />
          {/* Overlay so text stays readable */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-background/90 from-0% via-background/80 via-30% to-transparent"
            aria-hidden
          />
        </div>

        {/* Content overlaid on the image */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl py-14 sm:py-20">
            <h1
              id="hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[2.75rem] font-bold tracking-tight text-foreground leading-tight mb-5"
            >
              {heroContent.title}
            </h1>
            {heroContent.description && (
              <p className="text-base text-muted-foreground mb-8 max-w-lg leading-relaxed">
                {heroContent.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-lg px-6">
                <Link to={heroContent.primaryCtaLink}>{heroContent.primaryCtaText}</Link>
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm font-medium uppercase tracking-wide">Or call</span>
                <a
                  // href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                  className="text-foreground font-semibold hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Phone className="h-4 w-4" />
                  {heroContent.phoneNumber}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full border-t border-border/40 bg-muted/20 py-16 sm:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why choose us</h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              We combine experienced care with modern tools so you can focus on getting better.
            </p>
          </div>
          <div className="mx-auto max-w-5xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 sm:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-primary/10 border border-primary/20 p-8 sm:p-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
              Ready to book your visit?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Sign up for an account to book appointments, view your history, and stay on top of your
              health.
            </p>
            <Button size="lg" asChild className="mt-6">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="w-full border-t border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Stethoscope className="h-12 w-12" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">About Care Clinic</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Care Clinic has been serving the community with reliable, person-centered healthcare.
                We offer general consultations, preventive care, and support for chronic
                conditions—all in a welcoming environment where you and your family can feel at
                ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h3 className="text-2xl font-bold text-foreground mb-8">What we stand for</h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {values.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/60 bg-card p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">{title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/40 bg-muted/20 py-16 sm:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">Our story</h3>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                Founded with a simple goal—to make quality healthcare approachable and
                convenient—Care Clinic has grown into a place where patients know they can count on
                consistent, respectful care. We use modern systems for scheduling and records so
                that your time with us is smooth, and our team is trained to listen and respond to
                your needs.
              </p>
              <p className="mt-4">
                Whether you need a routine check-up, follow-up for a long-term condition, or advice
                for your family, we are here to help. Get in touch or create an account to book your
                first appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="w-full border-t border-border/40 bg-background">
        <div className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Contact us</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Have a question or want to book a visit? Reach out by phone or email.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="flex min-w-0 gap-4 overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="break-words text-muted-foreground">{value}</p>
                    {sub && <p className="mt-0.5 break-words text-sm text-muted-foreground">{sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 bg-muted/30">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Stethoscope className="h-4 w-4" />
              <span className="text-sm font-medium">Care Clinic</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#home" className="hover:text-foreground transition-colors">
                Home
              </a>
              <a href="#about" className="hover:text-foreground transition-colors">
                About
              </a>
              <a href="#contact" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <p className="mt-4 text-center sm:text-left text-xs text-muted-foreground">
            © {new Date().getFullYear()} Care Clinic. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
