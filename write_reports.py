import os

with open('src/app/reports/page.tsx', 'w', encoding='utf-8') as f:
    f.write('''"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth } from "@/context/AuthContext";
import { getReports } from "@/services/reportsService";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

function formatSeconds(seconds: number) {
  if (seconds < 60) return \\${Math.floor(seconds)}s\\`;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m < 60) return \\${m}m s\\`;
  const h = Math.floor(m / 60);
  const remainingM = m % 60;
  return \\${h}h m\\`;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [days, setDays] = useState(30);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reports", user?.facultyId, days],
    queryFn: () => getReports(user?.facultyId || "", days),
    enabled: !!user?.facultyId,
  });

  const classGroups = data 
    ? Array.from(new Set(data.at_risk_students.map(s => s.class_group))) 
    : [];

  const currentClass = selectedClass || (classGroups.length > 0 ? classGroups[0] : null);

  const filteredStudents = data?.at_risk_students.filter(s => s.class_group === currentClass) || [];

  return (
    <div className="flex flex-1 flex-col bg-surface min-h-screen pb-20">
      <AppHeader
        title="Reports"
        subtitle="Detailed insights from your attendance data"
      />

      <div className="flex-1 space-y-4 px-5 py-5">
        <div className="flex justify-end">
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-surface-border rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner size={28} className="text-navy" />
          </div>
        )}

        {isError && (
          <ErrorState title="Failed to load reports" message="Please try again." onRetry={() => refetch()} />
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-surface-border shadow-sm">
                <p className="text-xs font-bold text-surface-muted uppercase">Total Time Saved</p>
                <p className="text-xl font-extrabold text-navy mt-1">
                  {formatSeconds(data.insights.time_saved.value_seconds)}
                </p>
                <p className={\\	ext-xs mt-1 \\`}>
                  {data.insights.time_saved.trend && data.insights.time_saved.trend >= 0 ? '↑' : '↓'} 
                  {Math.abs(data.insights.time_saved.trend || 0).toFixed(1)}% vs previous
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-surface-border shadow-sm">
                <p className="text-xs font-bold text-surface-muted uppercase">Avg. Processing Time</p>
                <p className="text-xl font-extrabold text-navy mt-1">
                  {formatSeconds(data.insights.processing_time.value_seconds / (data.insights.total_sessions.value || 1))}
                </p>
                <p className={\\	ext-xs mt-1 \\`}>
                  {data.insights.processing_time.trend && data.insights.processing_time.trend <= 0 ? '↓' : '↑'} 
                  {Math.abs(data.insights.processing_time.trend || 0).toFixed(1)}% vs previous
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-surface-border shadow-sm">
                <p className="text-xs font-bold text-surface-muted uppercase">Overall Attendance</p>
                <p className="text-xl font-extrabold text-navy mt-1">
                  {data.insights.overall_attendance.value_percentage.toFixed(1)}%
                </p>
                <p className={\\	ext-xs mt-1 \\`}>
                  {data.insights.overall_attendance.trend >= 0 ? '↑' : '↓'} 
                  {Math.abs(data.insights.overall_attendance.trend).toFixed(1)}% vs previous
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-surface-border shadow-sm">
                <p className="text-xs font-bold text-surface-muted uppercase">Total Sessions</p>
                <p className="text-xl font-extrabold text-navy mt-1">
                  {data.insights.total_sessions.value}
                </p>
                <p className={\\	ext-xs mt-1 \\`}>
                  {data.insights.total_sessions.trend >= 0 ? '↑' : '↓'} 
                  {Math.abs(data.insights.total_sessions.trend).toFixed(1)}% vs previous
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-surface-border shadow-sm mt-6">
              <h3 className="text-sm font-bold text-navy mb-4">Estimated Time: Manual vs Our App</h3>
              
              <div className="flex gap-4 mb-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-navy">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></div>
                  Manual (6s per student)
                </div>
                <div className="flex items-center gap-1.5 text-navy">
                  <div className="w-2.5 h-2.5 bg-success rounded-sm"></div>
                  Our App
                </div>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                    <Line type="monotone" dataKey="manual_time" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="app_time" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-surface-border">
                <div className="flex-1">
                  <p className="text-xs text-surface-muted">Total Time (Manual)</p>
                  <p className="text-lg font-bold text-navy">{formatSeconds(data.insights.manual_time.value_seconds)}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-surface-muted">Total Time (Our App)</p>
                  <p className="text-lg font-bold text-navy">{formatSeconds(data.insights.processing_time.value_seconds)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-surface-border shadow-sm mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Students Below 75%</h3>
              </div>

              {classGroups.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs text-surface-muted block mb-1">Class</label>
                  <select 
                    value={currentClass || ""}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border border-surface-border rounded-md px-3 py-1.5 text-sm bg-white w-full max-w-[200px]"
                  >
                    {classGroups.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-surface-border text-xs text-surface-muted">
                        <th className="py-2 px-1 font-semibold">ID</th>
                        <th className="py-2 px-1 font-semibold">Name</th>
                        <th className="py-2 px-1 font-semibold text-right">Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => (
                        <tr key={student.student_id} className="border-b border-surface-border/50 last:border-0">
                          <td className="py-3 px-1 text-navy font-medium">{student.roll_number}</td>
                          <td className="py-3 px-1 text-navy">{student.name}</td>
                          <td className="py-3 px-1 text-error font-bold text-right">{student.attendance.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-surface-muted py-4 text-center">No students below 75% in this class.</p>
              )}
            </div>
          </>
        )}
      </div>

      <AppFooter />
    </div>
  );
}
''')
