/**
 * File export utilities for saving data to local files
 */

/**
 * Export data to a JSON file that will be downloaded by the browser
 * 
 * @param data - The data object to be saved
 * @param filename - The name of the file (without extension)
 * @returns void
 */
export const exportToJsonFile = (data: any, filename: string): void => {
  try {
    // Convert the data object to a JSON string
    const jsonData = JSON.stringify(data, null, 2);
    
    // Create a Blob containing the data
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    
    // Set the link's attributes
    link.href = url;
    link.download = `${filename}.json`;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Programmatically click the link to trigger the download
    link.click();
    
    // Clean up by removing the link and revoking the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Data exported successfully to ${filename}.json`);
  } catch (error) {
    console.error('Error exporting data to file', error);
    throw new Error('Failed to export data');
  }
};

/**
 * Export data to a CSV file that will be downloaded by the browser
 * 
 * @param data - Array of objects to be converted to CSV
 * @param filename - The name of the file (without extension)
 * @param headers - Optional array of header names (if not provided, will use object keys)
 * @returns void
 */
export const exportToCsvFile = (
  data: Record<string, any>[],
  filename: string,
  headers?: string[]
): void => {
  try {
    if (!data.length) {
      throw new Error('No data to export');
    }
    
    // Use object keys as headers if not provided
    const headerKeys = headers || Object.keys(data[0]);
    
    // Create CSV header row
    let csvContent = headerKeys.join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
      const row = headerKeys.map(key => {
        // Handle special characters and ensure proper CSV formatting
        let cell = item[key] === null || item[key] === undefined ? '' : item[key].toString();
        // Escape quotes and wrap in quotes if contains comma, newline or quote
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          cell = '"' + cell.replace(/"/g, '""') + '"';
        }
        return cell;
      }).join(',');
      csvContent += row + '\n';
    });
    
    // Create a Blob containing the data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    
    // Set the link's attributes
    link.href = url;
    link.download = `${filename}.csv`;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Programmatically click the link to trigger the download
    link.click();
    
    // Clean up by removing the link and revoking the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Data exported successfully to ${filename}.csv`);
  } catch (error) {
    console.error('Error exporting data to CSV file', error);
    throw new Error('Failed to export data to CSV');
  }
};

/**
 * File export/import utilities for saving and loading data to/from local files
 */

/**
 * Import data from a JSON file that was previously exported
 * 
 * @param file - The File object to import
 * @returns Promise that resolves to the imported data object
 */
export const importFromJsonFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a FileReader to read the file content
      const reader = new FileReader();
      
      // Set up the onload event handler
      reader.onload = (event) => {
        try {
          // Parse the JSON content
          const result = event.target?.result;
          if (typeof result === 'string') {
            const jsonData = JSON.parse(result);
            resolve(jsonData);
          } else {
            reject(new Error('Invalid file content format'));
          }
        } catch (parseError) {
          console.error('Error parsing JSON file', parseError);
          reject(new Error('Failed to parse JSON file'));
        }
      };
      
      // Set up the onerror event handler
      reader.onerror = (error) => {
        console.error('Error reading file', error);
        reject(new Error('Failed to read file'));
      };
      
      // Read the file as text
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing data from file', error);
      reject(new Error('Failed to import data'));
    }
  });
}; 