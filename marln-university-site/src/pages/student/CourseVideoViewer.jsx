import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import SageAISummaryPanel from '../../components/SageAISummaryPanel';
import { getTranscriptByVideoUrl } from '../../data/videoTranscripts';
import { useTranslation } from 'react-i18next';

function CourseVideoViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState(null);
  const { t } = useTranslation();
  
  // Video URL can be passed via state or query param
  const videoUrl = location.state?.videoUrl || '';
  const title = location.state?.title || t('student.videoViewer.title');

  // Get transcript data when video URL changes
  useEffect(() => {
    if (videoUrl) {
      const transcript = getTranscriptByVideoUrl(videoUrl);
      setCurrentTranscript(transcript);
    }
  }, [videoUrl]);

  const handleSummarizeClick = () => {
    if (currentTranscript) {
      setIsSummaryPanelOpen(true);
    }
  };

  const handleCloseSummaryPanel = () => {
    setIsSummaryPanelOpen(false);
  };



  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <h2 className="text-white text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-3">
          {/* Sage AI Summarize Button */}
          {currentTranscript ? (
            <button
              onClick={handleSummarizeClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              title={t('student.videoViewer.summarizeTitle')}
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">{t('student.videoViewer.summarizeTitle')}</span>
              <span className="sm:hidden">{t('student.videoViewer.summarizeShort')}</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-gray-300 rounded-lg font-medium cursor-not-allowed opacity-50"
              title={t('student.videoViewer.noTranscriptTitle')}
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">{t('student.videoViewer.noTranscriptLabel')}</span>
              <span className="sm:hidden">{t('student.videoViewer.noTranscriptShort')}</span>
            </button>
          )}
          
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-red-400 p-2 rounded-full transition-colors"
            aria-label={t('student.videoViewer.close')}
          >
            <X size={28} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-black relative">
        {videoUrl ? (
          <>
            <video
              src={videoUrl}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              className="w-full max-w-4xl h-[70vh] bg-black rounded shadow"
              style={{ outline: 'none' }}
            >
              {t('student.videoViewer.unsupported')}
            </video>
            

          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">{t('student.videoViewer.notFound')}</div>
        )}
      </div>

      {/* Sage AI Summary Panel */}
      <SageAISummaryPanel
        key={videoUrl} // Force complete reset when video changes
        isOpen={isSummaryPanelOpen}
        onClose={handleCloseSummaryPanel}
        videoTitle={currentTranscript?.title || title}
        summary={currentTranscript?.summary || ''}
      />


    </div>
  );
}

export default CourseVideoViewer; 