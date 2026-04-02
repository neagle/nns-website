interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value text-2xl font-semibold">{value}</div>
      {description && <div className="stat-desc">{description}</div>}
    </div>
  );
}
