/**
 * youtubeValidation.js
 *
 * Validates a YouTube URL using the YouTube Data API v3.
 *
 * Educational categories accepted:
 *   27 - Education
 *   28 - Science & Technology
 *   25 - News & Politics  (optional — useful for Olympiad/current events topics)
 *
 * The API key must be set in your .env:
 *   VITE_YOUTUBE_API_KEY=AIza...
 */

const EDUCATIONAL_CATEGORY_IDS = new Set(['27', '28', '25'])

/**
 * Extracts the YouTube video ID from common URL formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYoutubeVideoId(url = '') {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?.*[?&]v=([A-Za-z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.trim().match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

/**
 * Validates a YouTube URL for educational content.
 *
 * Returns an object:
 *   { valid: true,  videoId, title, categoryId, categoryName }
 *   { valid: false, reason: 'not_found' | 'not_educational' | 'restricted' | 'invalid_url' | 'api_error', message }
 *
 * @param {string} url - The YouTube URL to validate
 * @returns {Promise<{valid: boolean, videoId?: string, title?: string, categoryId?: string, reason?: string, message?: string}>}
 */
export async function validateYoutubeUrl(url) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

  // 1. Extract video ID
  const videoId = extractYoutubeVideoId(url)
  if (!videoId) {
    return { valid: false, reason: 'invalid_url', message: 'This does not look like a valid YouTube URL.' }
  }

  // 2. If no API key configured, skip category check and allow any valid URL
  if (!apiKey) {
    console.warn('[youtubeValidation] VITE_YOUTUBE_API_KEY is not set — skipping category check.')
    return { valid: true, videoId, title: 'Unknown (API key not configured)', categoryId: null }
  }

  // 3. Fetch video metadata from YouTube Data API v3
  try {
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${videoId}&key=${apiKey}`
    const res = await fetch(endpoint)

    if (!res.ok) {
      console.error('[youtubeValidation] YouTube API HTTP error:', res.status)
      return { valid: false, reason: 'api_error', message: 'Could not verify the video. Check your YouTube API key.' }
    }

    const data = await res.json()

    // 4. Check video exists
    if (!data.items || data.items.length === 0) {
      return { valid: false, reason: 'not_found', message: 'Video not found. It may be private, deleted, or the URL is incorrect.' }
    }

    const video = data.items[0]
    const snippet = video.snippet
    const status  = video.status

    // 5. Check if video is publicly viewable
    if (status?.privacyStatus !== 'public') {
      return {
        valid: false,
        reason: 'restricted',
        message: `This video is ${status?.privacyStatus ?? 'not public'}. Only public videos can be used as lesson material.`,
      }
    }

    // 6. Check age restrictions
    if (status?.contentRating?.ytRating === 'ytAgeRestricted') {
      return { valid: false, reason: 'restricted', message: 'This video is age-restricted and cannot be used as lesson material.' }
    }

    // 7. Check educational category
    const categoryId = snippet?.categoryId
    if (!EDUCATIONAL_CATEGORY_IDS.has(categoryId)) {
      const CATEGORY_NAMES = {
        '1': 'Film & Animation', '2': 'Autos & Vehicles', '10': 'Music',
        '15': 'Pets & Animals', '17': 'Sports', '18': 'Short Movies',
        '19': 'Travel & Events', '20': 'Gaming', '21': 'Videoblogging',
        '22': 'People & Blogs', '23': 'Comedy', '24': 'Entertainment',
        '25': 'News & Politics', '26': 'How-to & Style', '27': 'Education',
        '28': 'Science & Technology', '29': 'Nonprofits & Activism',
      }
      const categoryName = CATEGORY_NAMES[categoryId] ?? `category ${categoryId}`
      return {
        valid: false,
        reason: 'not_educational',
        message: `This video is categorized as "${categoryName}", not Education or Science & Technology. Only educational videos are allowed.`,
        title: snippet?.title,
        categoryId,
      }
    }

    return {
      valid: true,
      videoId,
      title: snippet?.title,
      categoryId,
      categoryName: categoryId === '27' ? 'Education' : categoryId === '28' ? 'Science & Technology' : 'News & Politics',
    }
  } catch (err) {
    console.error('[youtubeValidation] Unexpected error:', err)
    return { valid: false, reason: 'api_error', message: 'Failed to validate the video. Please try again.' }
  }
}
