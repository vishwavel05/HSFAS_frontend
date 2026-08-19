import { useEffect, useRef, useState } from "react";

export const PROCESSING_STAGES = [
  "Analyzing Images",
  "Detecting Faces",
  "Matching Students",
  "Generating Attendance",
] as const;

export type StageStatus = "completed" | "in_progress" | "pending";

// Target duration for the full visual progress sweep. This is a frontend
// visualization only — the backend sends one final response after ~20s,
// not per-stage updates. See AttendanceFlowContext.submitForProcessing.
const DURATION_MS = 20000;

// While waiting on the backend, the timer-driven progress is capped just
// short of 100% so the UI never visually claims "done" before the actual
// response arrives (per the "backend response is the source of truth"
// requirement). Once the response *does* arrive, ACCELERATE_MS smoothly
// closes the remaining gap instead of an abrupt jump to 100%.
const WAITING_CAP = 99;
const ACCELERATE_MS = 500;

const STAGE_BOUNDS = [25, 50, 75, 100];

/**
 * Drives the frontend-only processing visualization: a smooth 0-100%
 * progress sweep over ~20s, mapped onto 4 stage indicators.
 *
 * `isSuccess` reflects the *real* backend response (AttendanceFlowContext's
 * processStatus === "success"), not a timer. Two cases:
 *  - Backend is slower than the animation: progress holds at WAITING_CAP
 *    and the final stage stays in the "in_progress" (spinner) state —
 *    it never becomes "completed" from the timer alone.
 *  - Backend responds before the animation finishes: remaining progress is
 *    animated quickly (ACCELERATE_MS) up to 100% rather than jumping, then
 *    the final stage flips to "completed".
 *
 * Uses requestAnimationFrame with cancellation captured in the effect's
 * own closure (same pattern/reasoning as the previous setTimeout fix this
 * hook replaces): every effect run's cleanup cancels its own frame before
 * a new one is scheduled, so a React 18 StrictMode mount/cleanup/remount
 * pass can't leave a stray animation loop running against stale state.
 */
export function useProcessingAnimation(active: boolean, isSuccess: boolean) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const accelRef = useRef<{ startTime: number; from: number } | null>(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let rafId: number;

    function tick(now: number) {
      if (cancelled) return;

      if (startRef.current === null) {
        startRef.current = now;
      }

      if (isSuccess) {
        if (!accelRef.current) {
          accelRef.current = { startTime: now, from: progressRef.current };
        }
        const { startTime, from } = accelRef.current;
        // If the backend finishes instantly (e.g. 50ms), animating from 0 to 100
        // in 500ms feels like a glitch. Dynamically calculate duration so a full
        // sweep takes 2.5s minimum to give the illusion of processing, but a tiny
        // gap from 99% still closes smoothly in 500ms.
        const duration = Math.max(500, (100 - from) * 25);
        const t = Math.min(1, (now - startTime) / duration);
        const next = from + (100 - from) * t;
        progressRef.current = next;
        setProgress(next);
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        }
        return;
      }

      const elapsed = now - (startRef.current ?? now);
      const next = Math.min(WAITING_CAP, (elapsed / DURATION_MS) * 100);
      progressRef.current = next;
      setProgress(next);
      if (next < WAITING_CAP) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [active, isSuccess]);

  const stageStatuses: StageStatus[] = PROCESSING_STAGES.map((_, i) => {
    const lower = i === 0 ? 0 : STAGE_BOUNDS[i - 1];
    const upper = STAGE_BOUNDS[i];
    const isLastStage = i === PROCESSING_STAGES.length - 1;

    if (progress >= upper) {
      // The final stage only ever shows "completed" once the real backend
      // response has arrived — reaching 100% via the timer alone (capped
      // at WAITING_CAP, so this only happens post-acceleration) always
      // coincides with isSuccess being true by construction.
      if (isLastStage) return isSuccess ? "completed" : "in_progress";
      return "completed";
    }
    if (progress >= lower) return "in_progress";
    return "pending";
  });

  return {
    progress,
    stageStatuses,
    hasReachedFinalStage: progress >= 100,
  };
}
