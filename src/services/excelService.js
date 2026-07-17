import { apiRequest } from '@/services/apiClient';

export const excelService = {
  async generateTemplate(payload, trace = {}) {
    const blob = await apiRequest('/api/v1/excel/generate-template', {
      method: 'POST',
      body: payload,
      responseType: 'blob',
      headers: {
        ...(trace.requestId ? { 'X-Request-ID': trace.requestId } : {}),
        ...(trace.correlationId ? { 'X-Correlation-ID': trace.correlationId } : {}),
      },
    });
    return blob;
  },

  async downloadTemplate(payload, filename = 'planning-template.xlsx', trace) {
    const blob = await this.generateTemplate(payload, trace);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
};
