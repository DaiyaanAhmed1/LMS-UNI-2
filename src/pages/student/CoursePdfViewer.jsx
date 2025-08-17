import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Sparkles, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SageAISummaryPanel from '../../components/SageAISummaryPanel';

function CoursePdfViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pdfUrl = location.state?.pdfUrl || '';
  const title = location.state?.title || t('student.pdfViewer.title');

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSummarize = () => {
    // Lock PDF summarization to PRO: open panel without summary (upsell shows)
    setIsGenerating(false);
    setSummary('');
    setIsPanelOpen(true);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 flex flex-col z-50 select-none"
      onContextMenu={e => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
    >
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <h2 className="text-white text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {pdfUrl && (
            <button
              onClick={handleSummarize}
              className="px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm flex items-center gap-2"
              aria-label={t('student.pdfViewer.summarize')}
            >
              <Lock size={16} />
              {t('student.pdfViewer.summarize')}
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-red-400 p-2 rounded-full"
            aria-label={t('student.pdfViewer.close')}
          >
            <X size={28} />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black relative">
        {pdfUrl ? (
          <>
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={t('student.pdfViewer.iframeTitle')}
              className="w-full h-full min-h-[80vh] pointer-events-auto"
              style={{ border: 'none', pointerEvents: 'auto' }}
              allowFullScreen
            ></iframe>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">{t('student.pdfViewer.notFound')}</div>
        )}
      </div>

      <SageAISummaryPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        videoTitle={title}
        summary={summary}
        isGenerating={isGenerating}
        proLock={true}
      />
    </div>
  );
}

export default CoursePdfViewer; 