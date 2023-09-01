export const fetchConfig = async (): Promise<{ apiBaseUrl: string }> => {
  try {
    const response = await fetch("/config.json"); // Adjust the path if needed
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
};
