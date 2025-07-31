import React, { createContext, useContext, ReactNode } from 'react';
import { useDocumentTypes } from '../infrastructure/ui/hooks/useDocumentTypes';
import type { DocumentType } from '../domain/models/DocumentType';

// Define the shape of the context value
interface DocumentTypeContextValue {
  documentTypes: DocumentType[];
  addDocumentType: (name: string) => Promise<void>;
  updateDocumentType: (id: string, name: string) => Promise<void>;
  deleteDocumentType: (id: string) => Promise<void>;
  loadDocumentTypes: () => Promise<void>;
}

// Create the context with a default value of undefined, and specify the type
const DocumentTypeContext = createContext<DocumentTypeContextValue | undefined>(undefined);

// Provider component
export const DocumentTypeProvider = ({ children }: { children: ReactNode }) => {
  const contextValue = useDocumentTypes();
  return (
    <DocumentTypeContext.Provider value={contextValue}>
      {children}
    </DocumentTypeContext.Provider>
  );
};

// Custom hook to consume the context
export const useDocumentTypeContext = (): DocumentTypeContextValue => {
  const context = useContext(DocumentTypeContext);
  if (context === undefined) {
    throw new Error("useDocumentTypeContext must be used within a <DocumentTypeProvider>");
  }
  return context;
};
