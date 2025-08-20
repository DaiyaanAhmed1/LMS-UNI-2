import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Sparkles, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PDFSummaryPanel from '../../components/PDFSummaryPanel';

function CoursePdfViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pdfUrl = location.state?.pdfUrl || '';
  const title = location.state?.title || t('student.pdfViewer.title');

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleAnalyzePDF = () => {
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
              onClick={handleAnalyzePDF}
              className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm flex items-center gap-2 transition-all duration-200"
              aria-label={t('student.pdfViewer.analyzePDF', 'Analyze PDF with AI')}
            >
              <FileText size={16} />
              {t('student.pdfViewer.analyzePDF', 'Analyze PDF')}
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

      <PDFSummaryPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        pdfTitle={title}
        pdfUrl={pdfUrl}
      />
    </div>
  );
}

export default CoursePdfViewer; 