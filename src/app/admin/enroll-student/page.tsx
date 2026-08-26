"use client";

import { useState, useRef, FormEvent } from "react";
import { enrollStudent } from "@/services/adminService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

export default function EnrollStudentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    roll_number: "",
    full_name: "",
    department: "",
    year: "",
    section: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 5) {
        setError("Maximum 5 images allowed");
        return;
      }
      setError(null);
      setSelectedFiles(filesArray);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.roll_number || !formData.full_name || !formData.department || !formData.year || !formData.section) {
      setError("Please fill all text fields");
      return;
    }
    if (selectedFiles.length === 0) {
      setError("Please select at least 1 image");
      return;
    }

    const payload = new FormData();
    payload.append("roll_number", formData.roll_number);
    payload.append("full_name", formData.full_name);
    payload.append("department", formData.department);
    payload.append("year", formData.year);
    payload.append("section", formData.section);
    
    selectedFiles.forEach((file) => {
      payload.append("images", file);
    });

    setIsLoading(true);
    try {
      await enrollStudent(payload);
      setSuccess(`Student ${formData.full_name} enrolled successfully!`);
      setFormData({ roll_number: "", full_name: "", department: "", year: "", section: "" });
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to enroll student");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-5 py-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-navy mb-4">Register New Student</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            id="roll_number" label="Roll Number" placeholder="e.g. 21113054" 
            value={formData.roll_number} onChange={e => setFormData({...formData, roll_number: e.target.value})} 
          />
          <Input 
            id="full_name" label="Full Name" placeholder="e.g. Suresh Thevar" 
            value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} 
          />
          
          <div className="grid grid-cols-3 gap-2">
            <Input 
              id="department" label="Dept" placeholder="CSE" 
              value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} 
            />
            <Input 
              id="year" label="Year" placeholder="4" 
              value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} 
            />
            <Input 
              id="section" label="Section" placeholder="C" 
              value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} 
            />
          </div>

          <div className="mt-2">
            <label className="mb-1 block text-sm font-semibold text-navy">
              Reference Images (Max 5)
            </label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full rounded-xl border-2 border-dashed border-surface-border p-4 text-sm text-surface-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand-blue/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-brand-blue hover:file:bg-brand-blue/20 cursor-pointer"
            />
            {selectedFiles.length > 0 && (
              <p className="mt-2 text-xs font-semibold text-success">{selectedFiles.length} images selected</p>
            )}
          </div>

          {error && <p className="text-sm text-danger mt-2">{error}</p>}
          {success && <p className="text-sm text-success mt-2">{success}</p>}
          
          <Button type="submit" isLoading={isLoading} className="mt-4">
            Enroll Student
          </Button>
        </form>
      </Card>
    </div>
  );
}
