"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '@/components/footer';
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState('');

  const lastSearchedRef = useRef('');
  const activeSearchControllerRef = useRef<AbortController | null>(null);

  const skeletonItems = useMemo(() => Array.from({ length: 3 }), []);

  const runSearch = async (rawQuery: string, opts?: { clear?: boolean }) => {
    const q = rawQuery.trim();
    if (!q) return;

    if (lastSearchedRef.current === q) return;
    lastSearchedRef.current = q;

    activeSearchControllerRef.current?.abort();
    const controller = new AbortController();
    activeSearchControllerRef.current = controller;

    setLoading(true);
    setStatus('⏳ Đang nhờ Gemini đọc hiểu...');
    if (opts?.clear !== false) setResults([]);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (data.error) {
        setStatus(`❌ Lỗi: ${data.error}`);
      } else if (data.products?.length > 0) {
        setResults(data.products);
        setStatus(`✅ Tìm thấy ${data.products.length} sản phẩm phù hợp!`);
      } else {
        setStatus('🤔 Gemini không tìm thấy sản phẩm nào giống ý bạn.');
      }
    } catch (err) {
      if ((err as any)?.name === 'AbortError') return;
      setStatus('❌ Lỗi kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    lastSearchedRef.current = '';
    await runSearch(query, { clear: true });
  };

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      lastSearchedRef.current = '';
      setStatus('');
      setResults([]);
      return;
    }

    if (q.length < 2) return;

    const t = setTimeout(() => {
      runSearch(q, { clear: true });
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  const handleAskAI = async () => {
    const msg = chatInput.trim();
    if (!msg) return;

    setChatLoading(true);
    setChatStatus('Generating answer...');
    setChatAnswer('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      if (data.error) {
        setChatStatus(`Error: ${data.error}`);
        return;
      }

      const text = typeof data.answer === 'string' ? data.answer : '';
      setChatAnswer(text);
      setChatStatus(text ? 'Done.' : 'No answer returned.');
    } catch (err) {
      setChatStatus('Server connection error.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageContainer className="pt-28 pb-10">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="AI Semantic Search (Phase 2)"
            subtitle="Describe what you need - AI will find the best matches."
          />

          <div className="rounded-xl border bg-card p-5 sm:p-6">

            {/* Ô NHẬP LIỆU */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Example: Noise cancelling headphones for studying, thin-and-light laptop, best camera phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading} className="sm:w-28">
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* TRẠNG THÁI */}
            {status && (
              <p className="mt-4 text-sm font-medium text-muted-foreground" aria-live="polite">
                {status}
              </p>
            )}

            {/* KẾT QUẢ */}
            <div className="mt-6 space-y-3">
              {loading && results.length === 0 && (
                <>
                  {skeletonItems.map((_, idx) => (
                    <div key={idx} className="rounded-lg border bg-background p-4">
                      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                      <div className="mt-3 h-3 w-full rounded bg-muted animate-pulse" />
                      <div className="mt-2 h-3 w-5/6 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </>
              )}
              {results.map((product) => (
                <div key={product.id} className="rounded-lg border bg-background p-4">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-base font-semibold text-foreground">Ask AI (Phase 3)</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask in shopping context - AI answers using only available products.
              </p>

              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Example: Recommend a laptop under $1,000 for programming and long battery life"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                />
                <Button onClick={handleAskAI} disabled={chatLoading} className="sm:w-28">
                  {chatLoading ? 'Thinking...' : 'Ask'}
                </Button>
              </div>

              {chatStatus && (
                <p className="mt-3 text-sm font-medium text-muted-foreground" aria-live="polite">
                  {chatStatus}
                </p>
              )}

              {chatAnswer && (
                <div className="mt-4 rounded-lg border bg-background p-4">
                  <p className="whitespace-pre-wrap text-sm text-foreground">{chatAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      <Footer />
    </div>
  );
}