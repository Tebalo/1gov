'use server';

import { invUrl } from "@/app/lib/store";

/**
 * Function to fetch Docker containers from the API
 * @param baseUrl - Base URL of the Docker API (default: http://10.0.25.164:8084/trls-84)
 * @param includeAll - Whether to include all containers, including stopped ones (default: true)
 * @returns Promise with an array of DockerContainer objects
 */
export async function fetchContainerLogs(
  baseUrl: string = `${invUrl}`,
  containerName: string
): Promise<LogArray> {
  try {
    // Construct URL with query parameters
    const url = `${baseUrl}/containers/${containerName}/logs`;
    
    // Fetch data from API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers here if needed
      },
    });
    console.log('response', response);
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Error fetching Docker containers: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    
    // Type assertion to ensure the response matches our interface
    return data as LogArray;
  } catch (error) {
    console.error('Failed to fetch Docker containers:', error);
    throw error;
  }
}