import { apiRequest } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';
import { downloadBlob, filenameFromContentDisposition } from '@/lib/fileDownload';

export const bulkUserService = {
  downloadTemplate() {
    return apiRequest(ENDPOINTS.users.bulkTemplate, { responseType: 'blob', returnResponse: true })
      .then(({ data, response }) => downloadBlob(
        data,
        filenameFromContentDisposition(response.headers) || 'Zydus_User_Bulk_Template.xlsx',
      ));
  },
  upload(file) {
    const body = new FormData();
    body.append('file', file);
    return apiRequest(ENDPOINTS.users.bulkUpload, { method: 'POST', body });
  },
  getStatus: (jobId) => apiRequest(ENDPOINTS.users.bulkStatus(jobId)),
  getErrors: (jobId) => apiRequest(ENDPOINTS.users.bulkErrors(jobId)),
};
