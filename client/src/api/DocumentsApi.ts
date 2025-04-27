import client from './axiosClient';

export interface Document {
  document_id: string;
  title: string;
  description: string;
  assigned_to: string;
  status: string;
  created_at: string;
  created_by: string;
  versions: any[];
}

export default class DocumentsApi {
  /** List all documents for the current user */
  static list() {
    return client.get<Document[]>('/documents/');
  }

  /** Retrieve one document by ID */
  static get(id: string) {
    return client.get<Document>(`/documents/${id}/`);
  }

  /** Create a new document + initial version */
  static create(
    title: string,
    file: File,
    assignee_id: string,
    description?: string
  ) {
    const fd = new FormData();
    fd.append('title', title);
    if (description) {
      fd.append('description', description);
    }
    fd.append('file', file);
    fd.append('assignee_id', assignee_id);

    return client.post<Document>('/documents/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /** Create a new document + initial version */
  static save(id: string, document: any) {
    const { title, description, file } = document;
    const fd = new FormData();
    fd.append('title', title);
    if (description) {
      fd.append('description', description);
    }
    fd.append('file', file);

    return client.put<Document>(`/documents/${id}/`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /** Delete a document */
  static delete(id: string) {
    return client.delete(`/documents/${id}/`);
  }

  static approve(document_id: string) {
    return client.put(`/documents/${document_id}/action/approve/`);
  }
  static reject(document_id: string) {
    return client.put(`/documents/${document_id}/action/reject/`);
  }
  static archive(document_id: string) {
    return client.put(`/documents/${document_id}/action/archive/`);
  }
  static sign(document_id: string) {
    return client.put(`/documents/${document_id}/action/sign/`);
  }
}
