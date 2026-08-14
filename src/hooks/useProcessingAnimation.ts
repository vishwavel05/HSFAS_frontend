import { useEffect, useState } from "react";

export const PROCESSING_STAGES = [
  "Uploading Images",
  "Detecting Faces",
  "Generating Embeddings",
  "Matching Students",
  "Generating Attendance",
  "Finalizing Results",
] as const;

export type StageStatus = "completed" | "in_progress" | "pending";

const STAGE_DURATION_MS = 10000;
const FINAL_STAGE_INDEX = PROCESSING_STAGES.length - 1;

/**
 * Drives the fixed 10s-per-stage animation described in the PRD.
 *
 * BUG FIX (previous implementation): the progress animation used a single
 * `setInterval` started in an effect with an empty dependency array and no
 * cleanup that actually stopped a *previous* interval. Under React 18
 * StrictMode (which Next.js enables by default in dev), effects run
 * mount -> cleanup -> mount once on initial render; without a working
 * cleanup, that left two intervals ticking against the same state setter,
 * so stages advanced roughly twice as fast as intended and the final
 * "Finalizing Results" stage was sometimes skipped past entirely before
 * the backend had even responded.
 *
 * Fix: use `setTimeout` scheduled fresh from the *current* stage each time,
 * with a cancellation flag closed over by the effect's cleanup. Every
 * effect run is paired with a cleanup that cancels its own timer before
 * the next one is scheduled, so StrictMode's extra mount/cleanup pass
 * cannot leave a stray timer running.
 */
export function useProcessingAnimation(active: boolean) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (stageIndex >= FINAL_STAGE_INDEX) return; // final stage waits on the backend, not a timer

    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setStageIndex((i) => Math.min(i + 1, FINAL_STAGE_INDEX));
    }, STAGE_DURATION_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, stageIndex]);

  const stageStatuses: StageStatus[] = PROCESSING_STAGES.map((_, i) => {
    if (i < stageIndex) return "completed";
    if (i === stageIndex) return "in_progress";
    return "pending";
  });

  return {
    stageIndex,
    stageStatuses,
    hasReachedFinalStage: stageIndex === FINAL_STAGE_INDEX,
  };
}
