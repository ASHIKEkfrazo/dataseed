import React, { useState } from 'react';
import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';
import Dropzone from 'react-dropzone';

const AzureBlobUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const uploadToAzureBlobStorage = async (files) => {
    const blobServiceClient = new BlobServiceClient(
      `https://aceyolo6081014214.blob.core.windows.net`,
      new AnonymousCredential()
    );
    const containerClient = blobServiceClient.getContainerClient('azureml-blobstore-4cfddab7-116a-4503-a59b-82db3b8c2455');

    for (const file of files) {
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      await blockBlobClient.uploadBrowserData(file);
      setUploadedFiles(prevFiles => [...prevFiles, file]);
    }
  };

  return (
    <div>
      <h1>Upload Files to Azure Blob Storage</h1>
      <Dropzone onDrop={acceptedFiles => uploadToAzureBlobStorage(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      {uploadedFiles.length > 0 && (
        <div>
          <h2>Uploaded Files:</h2>
          <ul>
            {uploadedFiles.map(file => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AzureBlobUpload;
