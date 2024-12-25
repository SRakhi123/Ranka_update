import React from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useState } from 'react';

const dataGraph = [
  { name: 'Mon', active: 120, visited: 85, sell: 75 },
  { name: 'Tue', active: 150, visited: 100, sell: 95 },
  { name: 'Wed', active: 200, visited: 130, sell: 115 },
  { name: 'Thu', active: 180, visited: 120, sell: 110 },
  { name: 'Fri', active: 220, visited: 140, sell: 125 },
  { name: 'Sat', active: 250, visited: 180, sell: 160 },
  { name: 'Sun', active: 190, visited: 150, sell: 140 },
];

const pieData = [
  { name: 'Active Customers', value: 1200 },
  { name: 'Visited Customers', value: 850 },
  { name: 'Sell Customers', value: 750 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Statistics = () => {
  const [percentage, setPercentage] = useState({
    active: 80,
    visited: 60,
    sell: 50,
  });

  const sendAction = (type) => {
    alert(`${type} feature triggered!`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
       <div className="container mx-auto px-4 py-8 space-y-6 bg-white rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-gray-800 text-center flex-grow">Dashboard Report</h1>
           
            </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Cards */}
        {Object.entries(percentage).map(([key, value]) => (
          <div key={key} className="bg-white shadow p-4 rounded-lg">
            <h2 className="text-lg font-semibold capitalize">{key.replace('_', ' ')} (%)</h2>
            <p className="text-2xl font-bold text-blue-500">{value}%</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Daily Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataGraph}>
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="active" stroke="#8884d8" />
              <Line type="monotone" dataKey="visited" stroke="#82ca9d" />
              <Line type="monotone" dataKey="sell" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Customer Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => sendAction('Send SMS')}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
        >
          Send SMS
        </button>
        <button
          onClick={() => sendAction('Send WhatsApp SMS')}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600"
        >
          Send WhatsApp SMS
        </button>
        <button
          onClick={() => sendAction('Send Voice Call')}
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow hover:bg-yellow-600"
        >
          Send Voice Call
        </button>
      </div>
    </div>
  );
};

export default Statistics;
