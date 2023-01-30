import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import crypto from 'crypto';
import { env } from '$env/dynamic/private';

export async function getSasUrl(userId: string, fileName: string) {
	const containerName = 'blog-attachments';
	const containerClient = getContainerClient(containerName);

	const blockBlobClient = containerClient.getBlockBlobClient(
		userId + '/' + crypto.randomUUID() + '/' + fileName
	);
	return blockBlobClient.generateSasUrl({
		permissions: BlobSASPermissions.from({
			write: true
		}),
		expiresOn: new Date(new Date().setHours(new Date().getHours() + 1))
	});
}

function getBlobServiceClient() {
	console.log('Azure Blob storage v12 - JavaScript quickstart sample');

	const AZURE_STORAGE_CONNECTION_STRING = env.AZURE_STORAGE_CONNECTION_STRING;

	if (!AZURE_STORAGE_CONNECTION_STRING) {
		throw Error('Azure Storage Connection string not found');
	}

	// Create the BlobServiceClient object with connection string
	const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

	return blobServiceClient;
}

function getContainerClient(containerName: string) {
	const blobServiceClient = getBlobServiceClient();
	// Get a reference to a container
	const containerClient = blobServiceClient.getContainerClient(containerName);

	return containerClient;
}
