export type PromotionalVideoUploadResponse = Record<string, unknown>;

export type PromotionalVideoAuthResponse = {
    authUrl?: string;
};

export const uploadPromotionalVideo = async (payload: FormData): Promise<PromotionalVideoUploadResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promotional-video/upload`, {
        method: 'POST',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to upload promotional video');
    }

    return response.json();
};

export const getPromotionalVideoAuthUrl = async (): Promise<PromotionalVideoAuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promotional-video/auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get promotional video auth URL');
    }

    return response.json();
};
