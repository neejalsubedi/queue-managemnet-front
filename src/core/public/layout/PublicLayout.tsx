import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Stethoscope, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sectionLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const scrollToSection = (href: string) => {
  if (href === "/#home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const id = href.replace("/#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const PublicLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLanding = location.pathname === "/";

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollToSection(href);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="w-full flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-foreground hover:opacity-90 transition-opacity"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Stethoscope className="h-5 w-5" />
            </span>
            <span className="text-lg">Care Clinic</span>
          </Link>

          {/* Desktop nav - section anchors */}
          <div className="hidden md:flex items-center gap-1">
            {sectionLinks.map(({ href, label }) => {
              const isActive =
                isLanding &&
                (href === "/#home" ? !location.hash || location.hash === "#home" : location.hash === href.slice(1));
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleSectionClick(e, href)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {label}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background px-4 py-4">
            <div className="flex flex-col gap-1">
              {sectionLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    handleSectionClick(e, href);
                  }}
                  className="px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border/40 pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
