type MetricProps = {
  count: number;
  label: string;
  insight: string;
  colour: keyof typeof colourMap;
};

const colourMap = {
  green: "bg-green-100 text-green-900",
  blue: "bg-blue-100 text-blue-900",
  red: "bg-red-100 text-red-900",
};

export function Metric({ count, label, insight, colour }: MetricProps) {
  const cardStyle = `flex flex-col items-center justify-center  p-4 rounded-lg shadow ${colourMap[colour]}`;

  return (
    <div className={cardStyle}>
      <h3 className="text-xl md:text-2xl font-semibold">{count}</h3>
      <p className="mt-2 font-semibold">{label}</p>
      <p className="text-gray-700 mt-1">{insight}</p>
    </div>
  );
}
