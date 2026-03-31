"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export function Contact() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Start Your Investment Journey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with our team to discuss how BICFLOW CAPITAL can help you 
            achieve your investment objectives.
          </p>
          
          {submitted ? (
            <div className="mt-10 p-6 rounded-2xl bg-card border border-border">
              <p className="text-foreground font-medium">Thank you for your interest.</p>
              <p className="text-muted-foreground mt-2">
                A member of our team will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-card border-border focus:border-accent"
              />
              <Button 
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Request Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
          
          <p className="mt-6 text-sm text-muted-foreground">
            For accredited and institutional investors only. 
            Investment involves risk including loss of principal.
          </p>
        </div>
      </div>
    </section>
  );
}
