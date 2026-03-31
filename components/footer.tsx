import Link from "next/link";

const footerLinks = {
  company: [
    { name: "About", href: "#about" },
    { name: "Team", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#contact" },
  ],
  invest: [
    { name: "Strategies", href: "#strategies" },
    { name: "Performance", href: "#performance" },
    { name: "Insights", href: "#" },
    { name: "LP Login", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Disclosures", href: "#" },
    { name: "Regulatory", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
                BICFLOW
              </span>
              <span className="font-sans text-xs tracking-widest text-muted-foreground ml-1">
                CAPITAL
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Sophisticated investment solutions for discerning investors.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground">Invest</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.invest.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} BICFLOW CAPITAL. All rights reserved. 
            Past performance is not indicative of future results. 
            Investment involves risk including loss of principal.
          </p>
        </div>
      </div>
    </footer>
  );
}
