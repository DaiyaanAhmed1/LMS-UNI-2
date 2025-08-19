# Sage AI Summarization Feature

## Overview

The Sage AI Summarization feature enhances the video viewing experience by providing AI-generated summaries of lecture content. This feature is integrated into the CourseVideoViewer component and provides a seamless way for students to get quick overviews of video content.

## Features

- **AI-Generated Summaries**: Pre-generated summaries for each video based on transcripts
- **Typewriter Effect**: Animated text display that simulates real-time AI generation
- **Copy to Clipboard**: One-click copying of summaries for note-taking
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Fully compatible with the app's dark/light theme system
- **Smooth Animations**: Professional slide-in panel with backdrop blur

## Components

### 1. SageAISummaryPanel (`src/components/SageAISummaryPanel.jsx`)
- Reusable side panel component
- Handles typewriter animation
- Manages copy functionality
- Responsive design with mobile optimization

### 2. Typewriter Effect (`src/utils/typewriterEffect.js`)
- Custom React hooks for typewriter animation
- Configurable speed and delay options
- Clean animation with cursor effect

### 3. Video Transcripts (`src/data/videoTranscripts.js`)
- Hardcoded transcript data for all videos
- Helper functions for transcript retrieval
- Structured data format for easy maintenance

## Usage

### For Students
1. Navigate to any course video
2. Click the "Summarize with Sage AI" button in the video title bar
3. Watch the AI-generated summary appear with typewriter effect
4. Copy the summary to clipboard for note-taking
5. Close the panel when finished

### For Developers
The feature is modular and can be easily:
- Extended to support more videos
- Modified for different animation styles
- Integrated with real AI APIs
- Customized for different summary formats

## Data Structure

```javascript
{
  'video-id': {
    title: 'Video Title',
    transcript: 'Full transcript text...',
    summary: 'AI-generated summary...'
  }
}
```

## Technical Implementation

### Video URL Matching
The system extracts video identifiers from URLs to match with transcript data:
- URL: `https://.../course1-wk1-vid0001.mp4`
- Matches: `course1-wk1-vid0001` in transcript data

### Animation System
- Uses React hooks for state management
- CSS transitions for smooth panel animations
- JavaScript intervals for typewriter effect
- Fallback support for older browsers

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Focus management for modal dialogs

## Future Enhancements

1. **Real AI Integration**: Connect to actual AI services for dynamic summaries
2. **User Preferences**: Allow customization of summary length and style
3. **Offline Support**: Cache summaries for offline viewing
4. **Multi-language**: Support for multiple languages
5. **Analytics**: Track usage patterns and summary effectiveness

## Maintenance

### Adding New Videos
1. Add transcript data to `videoTranscripts.js`
2. Follow the naming convention: `course{number}-wk{week}-vid{week}.mp4`
3. Include title, transcript, and summary fields
4. Test the feature with the new video

### Modifying Animations
1. Edit `typewriterEffect.js` for timing changes
2. Modify `SageAISummaryPanel.jsx` for visual changes
3. Update CSS classes for styling changes

### Troubleshooting
- Check browser console for JavaScript errors
- Verify video URL format matches transcript keys
- Ensure all required dependencies are installed
- Test on different devices and screen sizes

## Dependencies

- React 18+
- Lucide React (for icons)
- Tailwind CSS (for styling)
- No external animation libraries required

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Transcripts are loaded on-demand
- Animations use CSS transforms for hardware acceleration
- Minimal re-renders through proper React optimization
- Efficient state management with custom hooks
