"use client";

const team = [
  {
    name: "Jonathan Mercer",
    role: "Managing Partner & CEO",
    bio: "25+ years in institutional asset management. Former CIO at Goldman Sachs Asset Management.",
    initials: "JM",
  },
  {
    name: "Sarah Chen",
    role: "Chief Investment Officer",
    bio: "Former portfolio manager at Bridgewater. PhD in Financial Economics from MIT.",
    initials: "SC",
  },
  {
    name: "Michael Okonkwo",
    role: "Head of Risk Management",
    bio: "20 years quantitative risk experience. Previously led risk at Citadel.",
    initials: "MO",
  },
  {
    name: "Elena Vasquez",
    role: "Director of Client Relations",
    bio: "15+ years serving institutional investors. Former VP at Morgan Stanley Wealth.",
    initials: "EV",
  },
];

export function Team() {
  return (
    <section id="team" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            Leadership
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
            Experienced Investment Professionals
          </h2>
          <p className="text-muted-foreground text-lg">
            Our team combines decades of institutional experience with a disciplined, 
            research-driven approach to investing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="group text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center border-2 border-border group-hover:border-accent transition-colors">
                <span className="font-serif text-2xl text-foreground">
                  {member.initials}
                </span>
              </div>
              <h3 className="font-serif text-xl text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-accent mb-3">
                {member.role}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
