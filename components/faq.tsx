"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the minimum investment requirement?",
    answer:
      "Our flagship fund has a minimum investment of $1 million for qualified investors. We also offer co-investment opportunities and separately managed accounts for larger allocations, typically starting at $25 million.",
  },
  {
    question: "What is your investment strategy?",
    answer:
      "We employ a multi-strategy approach combining fundamental analysis with quantitative risk management. Our core focus is on global equities, fixed income, and select alternative investments, with an emphasis on capital preservation and consistent risk-adjusted returns.",
  },
  {
    question: "How do you manage risk?",
    answer:
      "Risk management is embedded in every aspect of our process. We utilize proprietary risk models, maintain strict position limits, implement systematic hedging strategies, and conduct continuous stress testing across various market scenarios.",
  },
  {
    question: "What are your fee structures?",
    answer:
      "We operate on a management fee plus performance fee structure, aligned with institutional standards. Specific terms vary by investment vehicle and allocation size. We are committed to fee transparency and provide detailed breakdowns in our investor documentation.",
  },
  {
    question: "How often do you provide reporting?",
    answer:
      "Investors receive monthly performance reports, quarterly letters with market commentary, and annual audited financials. Our investor portal provides real-time access to portfolio positions, NAV, and transaction history.",
  },
  {
    question: "Who are your service providers?",
    answer:
      "We work with leading institutional service providers: our fund administrator is State Street, our auditor is PwC, our prime broker is Goldman Sachs, and our legal counsel is Simpson Thacher & Bartlett.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
              FAQ
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Common questions from prospective investors. For detailed information, 
              please request our investor documentation.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-background data-[state=open]:bg-secondary/50"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
