"use client";

import { useEffect, useRef, useState } from "react";
import exifr from 'exifr';
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { MethodCard } from "@/components/start-attendance/MethodCard";
import { Card } from "@/components/ui/Card";
import { useAttendanceFlow, MAX_IMAGES } from "@/context/AttendanceFlowContext";

const INSTRUCTIONS = [
  "Capture clear images with proper lighting",
  "Make sure all students' faces are visible",
  "Avoid blur or dark images",
  'Click "Process Attendance" after preview',
];

function StartAttendanceScreen() {
  const router = useRouter();
  const { addImages, images, selectedSlot } = useAttendanceFlow();
  const [warning, setWarning] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Guard: this screen now depends on a timetable period having been
  // selected (that's where timetable_slot_id + date come from, both
  // required by POST /api/attendance/). Arriving here without one — e.g.
  // a direct link, or a hard refresh that dropped in-memory context state
  // — sends the faculty back to pick a period instead of letting them
  // capture images that can never be submitted.
  useEffect(() => {
    if (!selectedSlot) {
      router.replace("/timetable");
    }
  }, [selectedSlot, router]);

function parseSlotTimeBounds(timeString: string): { start: Date, end: Date } | null {
  if (!timeString) return null;
  const parts = timeString.split("-").map(s => s.trim());
  if (parts.length !== 2) return null;
  
  const parseTime = (tStr: string) => {
    const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    let [_, h, m, ampm] = match;
    let hours = parseInt(h, 10);
    const mins = parseInt(m, 10);
    if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
    
    const d = new Date();
    d.setHours(hours, mins, 0, 0);
    return d;
  };
  
  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  if (!start || !end) return null;
  return { start, end };
}

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    
    const validFiles: { file: File, captureTime?: string }[] = [];
    const bounds = selectedSlot?.time ? parseSlotTimeBounds(selectedSlot.time) : null;
    let rejectedByTime = 0;
    let rejectedByMissingExif = 0;

    for (const file of files) {
      try {
        const exifData = await exifr.parse(file, ['DateTimeOriginal']);
        if (!exifData || !exifData.DateTimeOriginal) {
          rejectedByMissingExif++;
          continue;
        }

        const captureTime = typeof exifData.DateTimeOriginal === 'string' 
            ? new Date(exifData.DateTimeOriginal) 
            : exifData.DateTimeOriginal;
            
        if (bounds && captureTime instanceof Date && !isNaN(captureTime.getTime())) {
          const minTime = new Date(bounds.start.getTime() - 15 * 60000);
          const maxTime = new Date(bounds.end.getTime() + 15 * 60000);
          
          if (captureTime < minTime || captureTime > maxTime) {
            rejectedByTime++;
            continue;
          }
        }
        
        const d = captureTime as Date;
        const formatted = `${d.getFullYear()}:${String(d.getMonth()+1).padStart(2,'0')}:${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
        
        validFiles.push({ file, captureTime: formatted });
      } catch (e) {
        rejectedByMissingExif++;
      }
    }

    if (rejectedByMissingExif > 0) {
      alert("One or more photos were rejected because they lack original timestamp data (e.g. screenshots or web downloads). Please use the original photo.");
    } else if (rejectedByTime > 0) {
      alert("One or more photos were rejected because they were not taken during the scheduled class period.");
    }

    if (validFiles.length === 0) return;

    const { accepted, rejected } = addImages(validFiles);

    if (rejected > 0) {
      setWarning(
        `Only ${MAX_IMAGES} images are allowed per attendance session. ${rejected} image${
          rejected === 1 ? " was" : "s were"
        } not added.`
      );
    } else {
      setWarning(null);
    }

    if (accepted > 0 || images.length > 0) {
      router.push("/image-preview");
    }
  }

  if (!selectedSlot) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <AppHeader
        title="Start Attendance"
        subtitle="Choose a method to capture images"
        onBack={() => router.push("/timetable")}
      />

      <div className="flex-1 space-y-4 px-5 py-5">
        {/* Confirms which timetable period this session is tied to, since
            department/year/section are no longer manually selected here —
            they (and timetable_slot_id/date) come entirely from the
            period picked on the Timetable screen. */}
        <div className="rounded-xl border border-brand-blue/30 bg-brand-blue-light px-4 py-3 text-sm text-navy">
          <span className="font-semibold">
            {selectedSlot.courseCode ?? "Selected class"}
          </span>
          {selectedSlot.courseName && ` · ${selectedSlot.courseName}`}
          {selectedSlot.time && (
            <span className="block text-xs text-navy/70">
              {selectedSlot.time}
            </span>
          )}
        </div>

        {warning && (
          <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-navy">
            {warning}
          </div>
        )}

        <MethodCard
          title="Upload Images"
          description="Upload class photos from your device"
          buttonLabel="Choose Images"
          onTrigger={() => uploadInputRef.current?.click()}
          variant="upload"
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4m0 0 4 4m-4-4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <MethodCard
          title="Use Camera"
          description="Capture photos using your device camera"
          buttonLabel="Open Camera"
          onTrigger={() => cameraInputRef.current?.click()}
          variant="camera"
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.5h7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          }
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <Card className="px-5 py-4">
          <p className="text-sm font-bold text-navy">Instructions</p>
          <ul className="mt-2 space-y-1.5">
            {INSTRUCTIONS.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm text-surface-muted"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-surface-muted" />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <AppFooter />
    </div>
  );
}

export default function StartAttendancePage() {
  return (
    <AuthGuard>
      <StartAttendanceScreen />
    </AuthGuard>
  );
}
