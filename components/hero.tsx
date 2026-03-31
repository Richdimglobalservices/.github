import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Now accepting qualified investors</span>
            <ArrowRight className="h-3 w-3" />
          </div>
          
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Strategic Investment Solutions for Lasting Wealth
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto text-pretty">
            BICFLOW CAPITAL delivers sophisticated investment strategies designed for 
            institutional and high-net-worth investors seeking consistent, risk-adjusted 
            returns across market cycles.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base"
            >
              Request Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-muted-foreground hover:text-foreground px-8 py-6 text-base"
            >
              View Our Approach
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
