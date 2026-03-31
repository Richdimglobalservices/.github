export function About() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Built on Principles of Trust and Performance
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              BICFLOW CAPITAL was founded with a singular mission: to deliver 
              exceptional investment outcomes through disciplined strategies and 
              unwavering integrity.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our team brings decades of combined experience across global markets, 
              alternative investments, and institutional asset management. We serve 
              as fiduciaries to our clients, aligning our interests with theirs 
              through meaningful co-investment.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-2xl font-serif font-medium text-foreground">Global</p>
                <p className="text-sm text-muted-foreground mt-1">Investment Reach</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-medium text-foreground">Aligned</p>
                <p className="text-sm text-muted-foreground mt-1">Investor Interests</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-secondary border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="font-serif text-xl text-foreground mb-2">
                    &ldquo;Excellence is not a destination but a continuous journey.&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Investment Philosophy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
