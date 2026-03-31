"use client";

import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "BICFLOW has consistently delivered strong risk-adjusted returns while maintaining complete transparency. Their disciplined approach gives us confidence in any market environment.",
    author: "Robert Harriman",
    title: "CIO, Meridian Pension Fund",
    allocation: "$250M allocation",
  },
  {
    quote:
      "What sets BICFLOW apart is their genuine partnership approach. They take the time to understand our specific needs and constraints as a family office.",
    author: "Catherine Walsh",
    title: "Principal, Walsh Family Office",
    allocation: "$75M allocation",
  },
  {
    quote:
      "The team&apos;s risk management capabilities are exceptional. Through volatile markets, they&apos;ve protected capital while capturing upside opportunities.",
    author: "David Nakamura",
    title: "Trustee, Nakamura Foundation",
    allocation: "$180M allocation",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            Client Perspectives
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
            Trusted by Leading Institutions
          </h2>
          <p className="text-muted-foreground text-lg">
            We are honored to serve pension funds, endowments, foundations, and 
            family offices who share our commitment to long-term wealth preservation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-card border border-border rounded-lg p-8 flex flex-col"
            >
              <Quote className="w-8 h-8 text-accent/40 mb-6" />
              <blockquote className="text-foreground leading-relaxed mb-8 flex-1">
                {testimonial.quote}
              </blockquote>
              <div className="border-t border-border pt-6">
                <p className="font-serif text-lg text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {testimonial.title}
                </p>
                <p className="text-xs text-accent mt-2 font-medium">
                  {testimonial.allocation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
