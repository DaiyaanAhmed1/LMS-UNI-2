import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  BarChart2, 
  TrendingUp, 
  Users2, 
  Clock, 
  Target, 
  Award,
  ChevronDown,
  Eye,
  Download,
  Filter,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTour } from '../../context/TourContext.jsx';

// Enhanced data for insights
const insightsData = {
  coursePerformance: {
    last7: [65, 72, 78, 85, 82, 88, 92],
    lastSemester: [68, 72, 75, 80, 83, 87, 90, 88, 92, 89, 91, 94],
    lastYear: [70, 75, 78, 82, 85, 88, 90, 92, 89, 91, 93, 95]
  },
  studentEngagement: {
    last7: [45, 52, 48, 65, 58, 62, 68],
    lastSemester: [50, 55, 48, 62, 68, 65, 72, 70, 75, 73, 78, 82],
    lastYear: [55, 60, 65, 70, 68, 72, 75, 78, 80, 82, 85, 88]
  },
  timeSpent: {
    last7: [120, 135, 110, 150, 140, 160, 175],
    lastSemester: [125, 130, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185],
    lastYear: [130, 140, 150, 160, 165, 170, 175, 180, 185, 190, 195, 200]
  },
  progressTracking: {
    last7: [30, 35, 40, 45, 50, 55, 60],
    lastSemester: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
    lastYear: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
  }
};

const metricTypes = [
  { id: 'coursePerformance', labelKey: 'instructor.insights.metrics.coursePerformance', icon: TrendingUp, color: 'blue' },
  { id: 'studentEngagement', labelKey: 'instructor.insights.metrics.studentEngagement', icon: Users2, color: 'green' },
  { id: 'timeSpent', labelKey: 'instructor.insights.metrics.timeSpent', icon: Clock, color: 'purple' },
  { id: 'progressTracking', labelKey: 'instructor.insights.metrics.progressTracking', icon: Target, color: 'orange' }
];

const timeRanges = [
  { id: 'last7', labelKey: 'instructor.insights.ranges.last7' },
  { id: 'lastSemester', labelKey: 'instructor.insights.ranges.lastSemester' },
  { id: 'lastYear', labelKey: 'instructor.insights.ranges.lastYear' }
];

export default function Insights() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { startTour } = useTour();
  
  const [selectedMetric, setSelectedMetric] = useState('coursePerformance');
  const [selectedRange, setSelectedRange] = useState('last7');
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowMetricDropdown(false);
        setShowRangeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tour functionality
  useEffect(() => {
    // Auto-start tour for new users
    const key = 'tour:instructor:insights:v1:autostart';
    const hasSeenTour = localStorage.getItem(key);
    const tourCompleted = localStorage.getItem('tour:instructor:insights:v1:state');
    
    if (!hasSeenTour && tourCompleted !== 'completed') {
      setTimeout(() => {
        startInsightsTour();
        localStorage.setItem(key, 'shown');
      }, 100);
    }
    
    // Handle tour launches from navigation (coming from dashboard in full tour)
    const onLaunch = () => {
      const launch = localStorage.getItem('tour:launch');
      if (launch === 'instructor-resume') {
        localStorage.removeItem('tour:launch');
        setTimeout(() => startInsightsTour(), 200);
      }
    };
    window.addEventListener('tour:launch', onLaunch);
    return () => window.removeEventListener('tour:launch', onLaunch);
  }, []);

  const startInsightsTour = () => {
    const steps = [
      { 
        target: '[data-tour="insights-header"]', 
        title: t('instructor.tour.insights.header.title', 'Analytics Insights'), 
        content: t('instructor.tour.insights.header.desc', 'Welcome to the Insights page. Here you can analyze your teaching performance, student engagement, and course metrics.'), 
        placement: 'bottom', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="insights-metric-selector"]', 
        title: t('instructor.tour.insights.metricSelector.title', 'Select Metrics'), 
        content: t('instructor.tour.insights.metricSelector.desc', 'Choose which metric to analyze: course performance, student engagement, time spent, or progress tracking.'), 
        placement: 'bottom', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="insights-time-range"]', 
        title: t('instructor.tour.insights.timeRange.title', 'Time Range'), 
        content: t('instructor.tour.insights.timeRange.desc', 'Select the time period for your analysis: last 7 days, last semester, or last year.'), 
        placement: 'bottom', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="insights-chart"]', 
        title: t('instructor.tour.insights.chart.title', 'Data Visualization'), 
        content: t('instructor.tour.insights.chart.desc', 'View your selected metrics in an interactive chart. Hover over data points to see detailed values.'), 
        placement: 'top', 
        disableBeacon: true 
      },
      { 
        target: '[data-tour="insights-metrics"]', 
        title: t('instructor.tour.insights.metrics.title', 'Key Metrics'), 
        content: t('instructor.tour.insights.metrics.desc', 'Review important statistics like average, maximum, minimum values, and trend analysis for your selected metric.'), 
        placement: 'top', 
        disableBeacon: true 
      }
    ].filter(s => document.querySelector(s.target));
    
    if (steps.length) startTour('instructor:insights:v1', steps);
  };

  const currentData = insightsData[selectedMetric][selectedRange];

  // Calculate metrics
  const getAverage = (data) => Math.round(data.reduce((sum, val) => sum + val, 0) / data.length);
  const getMax = (data) => Math.max(...data);
  const getMin = (data) => Math.min(...data);
  const getTrend = (data) => {
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    return secondAvg > firstAvg ? 'up' : 'down';
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400'
    };
    return colors[color] || colors.blue;
  };

  const getBgColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20',
      green: 'bg-green-50 dark:bg-green-900/20',
      purple: 'bg-purple-50 dark:bg-purple-900/20',
      orange: 'bg-orange-50 dark:bg-orange-900/20'
    };
    return colors[color] || colors.blue;
  };

  const getStrokeColor = (color) => {
    const colors = {
      blue: '#3b82f6',
      green: '#22c55e',
      purple: '#8b5cf6',
      orange: '#f97316'
    };
    return colors[color] || colors.blue;
  };

  const getFillColor = (color) => {
    const colors = {
      blue: '#dbeafe',
      green: '#dcfce7',
      purple: '#ede9fe',
      orange: '#fed7aa'
    };
    return colors[color] || colors.blue;
  };

  const selectedMetricData = metricTypes.find(m => m.id === selectedMetric);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="instructor" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6" data-tour="insights-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getBgColorClass(selectedMetricData?.color)}`}>
                  <BarChart2 size={24} className={getColorClass(selectedMetricData?.color)} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('instructor.insights.title')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('instructor.insights.subtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/instructor/dashboard')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t('instructor.insights.backToDashboard')}
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Metric Selector */}
            <div className="relative dropdown-container" data-tour="insights-metric-selector">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('instructor.insights.selectMetric')}
              </label>
              <button
                onClick={() => setShowMetricDropdown(!showMetricDropdown)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <selectedMetricData.icon size={20} className={getColorClass(selectedMetricData?.color)} />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {t(selectedMetricData?.labelKey)}
                  </span>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {showMetricDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  {metricTypes.map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => {
                        setSelectedMetric(metric.id);
                        setShowMetricDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedMetric === metric.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <metric.icon size={20} className={getColorClass(metric.color)} />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {t(metric.labelKey)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time Range Selector */}
            <div className="relative dropdown-container" data-tour="insights-time-range">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('instructor.insights.selectRange')}
              </label>
              <button
                onClick={() => setShowRangeDropdown(!showRangeDropdown)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {t(`instructor.insights.ranges.${selectedRange}`)}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {showRangeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  {timeRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setSelectedRange(range.id);
                        setShowRangeDropdown(false);
                      }}
                      className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedRange === range.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {t(range.labelKey)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-tour="insights-metrics">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('instructor.insights.metrics.current')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {currentData[currentData.length - 1]}{selectedMetric === 'timeSpent' ? ' min' : '%'}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getBgColorClass(selectedMetricData?.color)}`}>
                  <TrendingUp size={20} className={getColorClass(selectedMetricData?.color)} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('instructor.insights.metrics.average')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {getAverage(currentData)}{selectedMetric === 'timeSpent' ? ' min' : '%'}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getBgColorClass(selectedMetricData?.color)}`}>
                  <Target size={20} className={getColorClass(selectedMetricData?.color)} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('instructor.insights.metrics.peak')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {getMax(currentData)}{selectedMetric === 'timeSpent' ? ' min' : '%'}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getBgColorClass(selectedMetricData?.color)}`}>
                  <Award size={20} className={getColorClass(selectedMetricData?.color)} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('instructor.insights.metrics.trend')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {getTrend(currentData) === 'up' ? '↗' : '↘'}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getBgColorClass(selectedMetricData?.color)}`}>
                  <TrendingUp size={20} className={getColorClass(selectedMetricData?.color)} />
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm" data-tour="insights-chart">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t(selectedMetricData?.labelKey)} - {t(`instructor.insights.ranges.${selectedRange}`)}
              </h2>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Download size={16} />
                <span className="text-sm">{t('instructor.insights.export')}</span>
              </button>
            </div>

            {/* Enhanced Chart */}
            <div className="relative">
              <svg viewBox="0 0 800 300" className="w-full h-64">
                {/* Y-axis labels */}
                {(() => {
                  const maxValue = Math.max(...currentData);
                  const minValue = Math.min(...currentData);
                  const range = maxValue - minValue;
                  const step = Math.ceil(range / 5);
                  const ticks = [];
                  for (let i = 0; i <= 5; i++) {
                    const tick = Math.round(minValue + (step * i));
                    if (tick <= maxValue) ticks.push(tick);
                  }
                  return ticks.map((tick, index) => (
                    <g key={tick}>
                      <line
                        x1="80"
                        y1={220 - ((tick - minValue) / range) * 160}
                        x2="720"
                        y2={220 - ((tick - minValue) / range) * 160}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                        className="dark:stroke-gray-700"
                      />
                      <text
                        x={isRTL ? "730" : "70"}
                        y={220 - ((tick - minValue) / range) * 160 + 4}
                        fontSize="12"
                        fill="#6b7280"
                        className="dark:fill-gray-500"
                        textAnchor={isRTL ? "end" : "start"}
                      >
                        {tick}{selectedMetric === 'timeSpent' ? 'm' : '%'}
                      </text>
                    </g>
                  ));
                })()}
                
                {/* Axes */}
                <line x1="80" y1="60" x2="80" y2="220" stroke="#d1d5db" strokeWidth="2" className="dark:stroke-gray-600" />
                <line x1="80" y1="220" x2="720" y2="220" stroke="#d1d5db" strokeWidth="2" className="dark:stroke-gray-600" />
                
                {/* Line chart */}
                <polyline
                  fill="none"
                  stroke={getStrokeColor(selectedMetricData?.color)}
                  strokeWidth="3"
                  points={(() => {
                    const maxValue = Math.max(...currentData);
                    const minValue = Math.min(...currentData);
                    const range = maxValue - minValue;
                    return currentData.map((value, index) => {
                      const x = 80 + (index / (currentData.length - 1)) * 640;
                      const y = 220 - ((value - minValue) / range) * 160;
                      return `${x},${y}`;
                    }).join(' ');
                  })()}
                />
                
                {/* Data points */}
                {currentData.map((value, index) => {
                  const maxValue = Math.max(...currentData);
                  const minValue = Math.min(...currentData);
                  const range = maxValue - minValue;
                  const x = 80 + (index / (currentData.length - 1)) * 640;
                  const y = 220 - ((value - minValue) / range) * 160;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={getStrokeColor(selectedMetricData?.color)}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="dark:stroke-gray-800"
                    />
                  );
                })}
                
                {/* X-axis labels */}
                {(() => {
                  const labels = selectedRange === 'last7' 
                    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    : selectedRange === 'lastSemester'
                    ? currentData.map((_, i) => `W${i + 1}`)
                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return labels.map((label, index) => (
                    <text
                      key={index}
                      x={80 + (index / (currentData.length - 1)) * 640}
                      y="240"
                      fontSize="12"
                      fill="#6b7280"
                      className="dark:fill-gray-500"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {label}
                    </text>
                  ));
                })()}
              </svg>
            </div>

            {/* Insights Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('instructor.insights.summary.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t(`instructor.insights.summary.${selectedMetric}`, {
                  current: currentData[currentData.length - 1],
                  average: getAverage(currentData),
                  peak: getMax(currentData),
                  trend: getTrend(currentData) === 'up' ? t('instructor.insights.summary.improving') : t('instructor.insights.summary.declining'),
                  unit: selectedMetric === 'timeSpent' ? t('instructor.insights.summary.minutes') : '%'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 