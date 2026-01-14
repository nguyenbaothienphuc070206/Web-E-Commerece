"use client";
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';

export default function PipelineTest() {
  const [status, setStatus] = useState("System Ready");
  const [loading, setLoading] = useState(false);

  const isSuccess = status.includes("✅");
  const isError = status.includes("❌");

  const runTest = async () => {
    setLoading(true);
    setStatus("⏳ Initializing Ingestion Pipeline...");
    
    // Create a mock 768-dimension vector for Gemini.
    const mockVector = Array(768).fill(0.1); 

    const { error } = await supabase.from('products').insert([{
      name: "Gemini Integration Test",
      description: "Baseline verification for 768-dimension vector ingestion.",
      embedding: mockVector
    }]);

    if (error) {
      setStatus("❌ Connection Failed: " + error.message);
    } else {
      setStatus("✅ PIPELINE VERIFIED: Data successfully synced to Supabase!");
    }
    setLoading(false);
  };

  const reset = () => {
    if (loading) return;
    setStatus("System Ready");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-4 pt-28 pb-10 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 rounded-xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Internal Test Page</p>
                <h1 className="text-3xl font-semibold tracking-tight">Supabase Vector Ingestion</h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Verifies the connection between <span className="font-medium text-foreground">Next.js</span> and{' '}
                  <span className="font-medium text-foreground">Supabase</span> by inserting a mock 768-dimension embedding into the{' '}
                  <span className="font-medium text-foreground">products</span> table.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={reset} variant="outline" disabled={loading}>
                  Reset
                </Button>
                <Button onClick={runTest} disabled={loading}>
                  {loading ? "Processing..." : "Run Mock Ingestion"}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 font-medium text-muted-foreground">
                Target: products
              </span>
              <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 font-medium text-muted-foreground">
                Embedding: float[768]
              </span>
              <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 font-medium text-muted-foreground">
                Operation: insert
              </span>
              <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 font-medium text-muted-foreground">
                Execution: client-side
              </span>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <section className="rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">Overview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This page performs one write to validate connectivity and schema compatibility.
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Writes: 1</p>
                    <p>Reads: 0</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-sm font-medium">Expected outcome</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      A success message appears and a new row shows up in Supabase.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-sm font-medium">Cleanup</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You may want to delete the test row after verification.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border bg-card p-5">
                <h2 className="text-base font-semibold">Payload preview</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is the exact shape sent to Supabase (embedding truncated for readability).
                </p>

                <div className="mt-4 rounded-lg border bg-background p-4">
                  <pre className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap wrap-break-word">
{`{
  "name": "Gemini Integration Test",
  "description": "Baseline verification for 768-dimension vector ingestion.",
  "embedding": [0.1, 0.1, 0.1, ...] // 768 items
}`}
                  </pre>
                </div>
              </section>

              <section className="rounded-xl border bg-card p-5">
                <h2 className="text-base font-semibold">Troubleshooting checklist</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Common reasons this insert fails in a browser context.
                </p>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-sm font-medium">Environment variables</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Confirm your Supabase URL/key are present and exposed correctly for the client.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-sm font-medium">RLS policies</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ensure the current auth context is allowed to insert into <span className="font-medium text-foreground">products</span>.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-sm font-medium">Schema match</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Double-check column names and that <span className="font-medium text-foreground">embedding</span> supports 768 dimensions.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">Pipeline status</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Live output from the client-side insert attempt.
                    </p>
                  </div>

                  <span
                    className={
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium " +
                      (loading
                        ? "bg-muted text-muted-foreground"
                        : isSuccess
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : isError
                            ? "border-destructive/30 bg-destructive/10 text-foreground"
                            : "bg-muted text-muted-foreground")
                    }
                  >
                    {loading ? "Running" : isSuccess ? "Success" : isError ? "Failed" : "Ready"}
                  </span>
                </div>

                <div
                  className={
                    "mt-4 rounded-lg border p-4 " +
                    (isSuccess
                      ? "border-primary/30 bg-primary/5"
                      : isError
                        ? "border-destructive/30 bg-destructive/5"
                        : "bg-background")
                  }
                  aria-live="polite"
                  aria-busy={loading}
                >
                  <p className={"text-sm font-medium " + (isError ? "text-destructive" : "text-foreground")}>
                    {status}
                  </p>
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                    <p>
                      Tip: confirm the new row exists in <span className="font-medium text-foreground">products</span>.
                    </p>
                    <p>
                      This page is intentionally <span className="font-medium text-foreground">client-side</span> ("use client") to validate browser-to-Supabase auth/config.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border bg-card p-5">
                <h2 className="text-base font-semibold">Controls</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use these actions to run the insert and reset the UI state.
                </p>

                <div className="mt-4 grid gap-2">
                  <Button onClick={runTest} disabled={loading}>
                    {loading ? "Working..." : "Run"}
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={loading}>
                    Reset
                  </Button>
                </div>

                <div className="mt-4 rounded-lg border bg-background p-4 text-sm">
                  <p className="font-medium">Reminder</p>
                  <p className="mt-1 text-muted-foreground">
                    This test inserts a row. If you run it multiple times, you will create multiple entries.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}