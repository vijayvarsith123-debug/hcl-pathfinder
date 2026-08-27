import { NextRequest, NextResponse } from "next/server";
import { processAdaptiveAssessmentAnalysis } from "@/lib/adaptive/adaptive-engine";
import { QuestionAttempt, SubtopicMastery } from "@/lib/adaptive/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { attempts = [], previousMastery = [] } = body;

    if (!Array.isArray(attempts)) {
      return NextResponse.json(
        { error: "Invalid request payload: 'attempts' must be an array." },
        { status: 400 }
      );
    }

    const result = await processAdaptiveAssessmentAnalysis(
      attempts as QuestionAttempt[],
      previousMastery as SubtopicMastery[]
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal adaptive assessment analysis error" },
      { status: 500 }
    );
  }
}
