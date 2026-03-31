const stats = [
  { label: "Assets Under Management", value: "$2.4B+" },
  { label: "Average Annual Return", value: "18.7%" },
  { label: "Years of Experience", value: "15+" },
  { label: "Institutional Partners", value: "120+" },
];

export function Stats() {
  return (
    <section id="performance" className="py-16 lg:py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl font-medium text-foreground lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
