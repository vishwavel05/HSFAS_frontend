"use client";

import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMetadata, assignLecture } from "@/services/adminService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";

export default function AssignLecturePage() {
  const { data: metadata, isLoading: metaLoading, error: metaError, refetch } = useQuery({
    queryKey: ["metadata"],
    queryFn: getMetadata,
  });

  const [formData, setFormData] = useState({
    faculty_id: "",
    course_code: "",
    day_of_week: "Monday",
    period_number: "",
    target_department: "",
    target_year: "",
    target_section: "",
    semester: "Odd",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setIsLoading(true);
    try {
      await assignLecture(formData);
      setSuccess("Lecture assigned successfully!");
      // Keep form data to allow rapid bulk assigning, maybe just reset course
      setFormData(prev => ({...prev, course_code: ""}));
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to assign lecture");
    } finally {
      setIsLoading(false);
    }
  };

  if (metaLoading) {
    return <div className="flex h-64 items-center justify-center"><LoadingSpinner className="text-brand-blue" /></div>;
  }
  if (metaError) {
    return <div className="p-5"><ErrorState title="Could not load metadata" message="Failed to load dropdowns" onRetry={refetch} /></div>;
  }

  return (
    <div className="px-5 py-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-navy mb-4">Assign Lecture</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col">
            <label className="mb-1 block text-sm font-semibold text-navy">Faculty</label>
            <select 
              value={formData.faculty_id} 
              onChange={e => setFormData({...formData, faculty_id: e.target.value})}
              className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-[15px] font-medium text-navy focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10"
              required
            >
              <option value="">Select Faculty...</option>
              {metadata?.faculties?.map((f: any) => (
                <option key={f.employee_id} value={f.employee_id}>{f.full_name} ({f.employee_id})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 block text-sm font-semibold text-navy">Course</label>
            <select 
              value={formData.course_code} 
              onChange={e => setFormData({...formData, course_code: e.target.value})}
              className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-[15px] font-medium text-navy focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10"
              required
            >
              <option value="">Select Course...</option>
              {metadata?.courses?.map((c: any) => (
                <option key={c.course_code} value={c.course_code}>{c.course_name} ({c.course_code})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 block text-sm font-semibold text-navy">Day of Week</label>
              <select 
                value={formData.day_of_week} 
                onChange={e => setFormData({...formData, day_of_week: e.target.value})}
                className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-[15px] font-medium text-navy focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10"
                required
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 block text-sm font-semibold text-navy">Period</label>
              <select 
                value={formData.period_number} 
                onChange={e => setFormData({...formData, period_number: e.target.value})}
                className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-[15px] font-medium text-navy focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10"
                required
              >
                <option value="">Select Period...</option>
                {metadata?.periods?.map((p: any) => (
                  <option key={p.period_number} value={p.period_number}>
                    Period {p.period_number} ({p.start_time.substring(0,5)} - {p.end_time.substring(0,5)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input id="target_department" label="Dept" placeholder="CSE" value={formData.target_department} onChange={e => setFormData({...formData, target_department: e.target.value})} required />
            <Input id="target_year" label="Year" placeholder="4" value={formData.target_year} onChange={e => setFormData({...formData, target_year: e.target.value})} required />
            <Input id="target_section" label="Section" placeholder="C" value={formData.target_section} onChange={e => setFormData({...formData, target_section: e.target.value})} required />
          </div>

          <div className="flex flex-col mt-2">
            <label className="mb-1 block text-sm font-semibold text-navy">Semester</label>
            <select 
              value={formData.semester} 
              onChange={e => setFormData({...formData, semester: e.target.value})}
              className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-[15px] font-medium text-navy focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10"
            >
              <option value="Odd">Odd</option>
              <option value="Even">Even</option>
            </select>
          </div>

          {error && <p className="text-sm text-danger mt-2">{error}</p>}
          {success && <p className="text-sm text-success mt-2">{success}</p>}
          
          <Button type="submit" isLoading={isLoading} className="mt-4">
            Assign Lecture
          </Button>
        </form>
      </Card>
    </div>
  );
}
