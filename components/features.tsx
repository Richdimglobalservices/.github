import { TrendingUp, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    name: "Diversified Portfolios",
    description:
      "Our multi-asset strategies span equities, fixed income, alternatives, and real assets to optimize risk-adjusted returns across market environments.",
    icon: BarChart3,
  },
  {
    name: "Risk Management",
    description:
      "Proprietary risk frameworks and continuous monitoring ensure portfolio resilience. We prioritize capital preservation alongside growth objectives.",
    icon: Shield,
  },
  {
    name: "Performance Focus",
    description:
      "Disciplined investment processes and rigorous due diligence drive consistent performance. Our track record speaks to our commitment to excellence.",
    icon: TrendingUp,
  },
];

export function Features() {
  return (
    <section id="strategies" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Investment Excellence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our approach combines rigorous analysis with disciplined execution to 
            deliver sustainable returns for our investors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative rounded-2xl bg-card border border-border p-8 hover:border-accent/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mb-6">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.name}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
