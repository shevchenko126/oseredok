// api/storage.ts
import { Config } from "react-native-config";
import { getToken } from "../helpers/keychain";
import type { Asset } from 'react-native-image-picker';
import {
  UploadFileApiV1ImagesUploadPostResponse,
  UploadFileApiV1UserAvatarsUploadPostResponse,
  GetFileApiV1UserAvatarsUserIdFilenameGetResponses
} from "../dto/storage/types.gen";
import RNFetchBlob from 'react-native-blob-util';
const API_STORAGE_URL = Config && Config.API_STORAGE_URL || "http://localhost:8002";

function normalizeUri(uri?: string) {
	console.log('Normalizing uri:', uri);
  if (!uri) return '';
  return uri.startsWith('file://') ? uri : `file://${uri}`;
}

export const uploadImage = async (asset: Asset) => {
	try {
		const token = await getToken();
		if (!token) throw new Error("No token");

		const formData = new FormData();
		formData.append('file', {
			uri: normalizeUri(asset.uri),
			name: asset.fileName ?? `photo_${Date.now()}.jpg`,
			type: asset.type ?? 'image/jpeg',
		} as any); 

		console.log('Uploading image with token:', token);
		console.log('Uploading image url:', `${API_STORAGE_URL}/api/v1/images/upload/`);

		const response = await fetch(`${API_STORAGE_URL}/api/v1/images/upload/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: formData,
		});

		if (!response.ok) throw new Error(`Status: ${response.status}`);

		const data: UploadFileApiV1ImagesUploadPostResponse = await response.json();
		return { data, error: false };
	} catch (error) {
		console.error("Upload file error:", error);
		return { data: null, error: true };
	}
};


export const getImage = async (filename:string) => {
	const token = await getToken();
	if (!token) throw new Error("No token");

	const res = await RNFetchBlob.config({ fileCache: true }).fetch(
		'GET',
		`${API_STORAGE_URL}/api/v1/images/${filename}/`,
		{ Authorization: `Bearer ${token}` }
	);
	return 'file://' + res.path();
};

// 	if (!response.ok) throw new Error(`Status: ${response.status}`);

// 	const data: GetFileApiV1ImagesFilenameGetResponses = await response.json();
// 	return { data, error: false };
// };

export const uploadAvatar = async (file: File) => {
	try {
		const token = await getToken();
		if (!token) throw new Error("No token");

		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_STORAGE_URL}/api/v1/user-avatars/upload/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) throw new Error(`Status: ${response.status}`);

		const data: UploadFileApiV1UserAvatarsUploadPostResponse = await response.json();
		return { data, error: false };
	} catch (error) {
		console.error("Upload avatar error:", error);
		return { data: null, error: true };
	}
};


export const getAvatar = async (filename:string) => {
	const token = await getToken();
	if (!token) throw new Error("No token");

	const response = await fetch(`${API_STORAGE_URL}/api/v1/user-avatars/my/${filename}/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) throw new Error(`Status: ${response.status}`);

	const data: GetFileApiV1UserAvatarsUserIdFilenameGetResponses = await response.json();
	return { data, error: false };
};



export const toThumbnailName = (filename:string) => {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return `${filename}_thumbnail`;

  const name = filename.slice(0, lastDot);
  const ext = filename.slice(lastDot);
  return `${name}_thumbnail${ext}`;
}