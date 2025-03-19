
'use server';

import { invUrl } from "@/app/lib/store";

/**
 * Function to fetch Docker containers from the API
 * @param baseUrl - Base URL of the Docker API (default: http://10.0.25.164:8084/trls-84)
 * @param includeAll - Whether to include all containers, including stopped ones (default: true)
 * @returns Promise with an array of DockerContainer objects
 */
export async function fetchDockerContainers(
  baseUrl: string = `${invUrl}`,
  includeAll: boolean = true
): Promise<DockerContainer[]> {
  try {
    // Construct URL with query parameters
    const url = `${baseUrl}/containers${includeAll ? '?all=true' : ''}`;
    
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
    return data as DockerContainer[];
  } catch (error) {
    console.error('Failed to fetch Docker containers:', error);
    throw error;
  }
}

/**
 * Get a single Docker container by ID
 * @param containerId - Docker container ID
 * @param baseUrl - Base URL of the Docker API (default: http://10.0.25.164:8084/trls-84)
 * @returns Promise with a DockerContainer object
 */
export async function getDockerContainerById(
  containerId: string,
  baseUrl: string = `${invUrl}`
): Promise<DockerContainer> {
  try {
    const url = `${baseUrl}/containers/${containerId}/json`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Docker container: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as DockerContainer;
  } catch (error) {
    console.error(`Failed to fetch Docker container with ID ${containerId}:`, error);
    throw error;
  }
}

