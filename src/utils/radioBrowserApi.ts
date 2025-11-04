/**
 * RADIO BROWSER API INTEGRATION
 * Interface with Radio Browser API for live radio streaming
 * API Docs: https://api.radio-browser.info/
 */

const API_BASE_URL = 'https://de1.api.radio-browser.info/json';

export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  bitrate: number;
  codec: string;
  clickcount: number;
  clicktrend: number;
}

/**
 * Get top radio stations by quality
 * @param limit Number of stations to return
 * @param minBitrate Minimum bitrate in kbps (default: 128)
 * @returns Array of radio stations sorted by votes
 */
export async function getTopStations(
  limit: number = 100,
  minBitrate: number = 128
): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stations/search?limit=${limit}&order=votes&reverse=true&hidebroken=true`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'TaTTy/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Radio Browser API error: ${response.status}`);
    }

    const stations: RadioStation[] = await response.json();

    // Filter by bitrate and remove stations without resolved URLs
    const filteredStations = stations.filter(
      (station) =>
        station.bitrate >= minBitrate &&
        station.url_resolved &&
        station.url_resolved.length > 0
    );

    return filteredStations;
  } catch (error) {
    console.error('Failed to fetch radio stations:', error);
    throw error;
  }
}

/**
 * Register a click for a station (helps track popularity)
 * @param stationUuid UUID of the station
 */
export async function registerClick(stationUuid: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/url/${stationUuid}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'TaTTy/1.0',
      },
    });
  } catch (error) {
    // Silently fail - this is not critical
    console.warn('Failed to register station click:', error);
  }
}

/**
 * Search stations by name, tag, or country
 * @param query Search term
 * @param limit Number of results
 */
export async function searchStations(
  query: string,
  limit: number = 50
): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stations/search?name=${encodeURIComponent(
        query
      )}&limit=${limit}&hidebroken=true`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'TaTTy/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Radio Browser API error: ${response.status}`);
    }

    const stations: RadioStation[] = await response.json();
    return stations;
  } catch (error) {
    console.error('Failed to search radio stations:', error);
    throw error;
  }
}
