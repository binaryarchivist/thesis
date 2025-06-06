import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function DocumentStatusChart({ data }) {
  if (!data || typeof data !== 'object') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center h-48">
        <h3 className="font-medium text-gray-600">No data available</h3>
        <p className="text-sm text-gray-500 mt-1">
          Chart will appear when data is loaded
        </p>
      </div>
    );
  }

  const chartData = [
    { name: 'Pending', value: data.pending || 0, color: '#f59e0b' },
    { name: 'Approved', value: data.approved || 0, color: '#10b981' },
    { name: 'Rejected', value: data.rejected || 0, color: '#ef4444' },
    { name: 'Signed', value: data.signed || 0, color: '#3b82f6' },
    { name: 'Archived', value: data.archived || 0, color: '#6b7280' },
  ].filter((item) => item.value > 0);

  const total = Object.values(data).reduce(
    (sum, current) => sum + (current || 0),
    0
  );

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center h-48">
        <h3 className="font-medium text-gray-600">No documents available</h3>
        <p className="text-sm text-gray-500 mt-1">
          Charts will appear when you create documents
        </p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 30, left: 0 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={10}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell className="mt-2" key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend  layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ top: 'auto', bottom: 0, fontSize: '0.75rem' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
