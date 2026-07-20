import { apiRequest } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';
import { downloadBlob, filenameFromContentDisposition } from '@/lib/fileDownload';

const templateFilename = (payload) => `Zydus_Template_${payload?.planning_cycle || 'Planning'}.xlsx`;

export const excelService = {
  generateTemplate(payload, trace = {}) {
    return apiRequest(ENDPOINTS.templates, {
      method: 'POST',
      body: payload,
      responseType: 'blob',
      headers: {
        ...(trace.requestId ? { 'X-Request-ID': trace.requestId } : {}),
        ...(trace.correlationId ? { 'X-Correlation-ID': trace.correlationId } : {}),
      },
    });
  },

  async downloadTemplate(payload, fallbackFilename, trace = {}) {
    const { data: blob, response } = await apiRequest(ENDPOINTS.templates, {
      method: 'POST', body: payload, responseType: 'blob', returnResponse: true,
      headers: {
        ...(trace.requestId ? { 'X-Request-ID': trace.requestId } : {}),
        ...(trace.correlationId ? { 'X-Correlation-ID': trace.correlationId } : {}),
      },
    });
    downloadBlob(blob, filenameFromContentDisposition(response.headers) || fallbackFilename || templateFilename(payload));
  },
};
