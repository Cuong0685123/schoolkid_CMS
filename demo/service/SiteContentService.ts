export type SiteContentRow = {
    id: string | number;
    phone_number?: string;
    support_email?: string;
    address?: string;
    admission_period?: string;
    stat_years_experience?: string;
    stat_students_info?: string;
    stat_awards_info?: string;
    footer_description?: string;
    about_section_quote?: string;
    created_at?: string;
    updated_at?: string;
};

export type CreateSiteContentPayload = {
    id: number;
} & Partial<Omit<SiteContentRow, 'id' | 'created_at' | 'updated_at'>>;

export type UpdateSiteContentPayload = Partial<Omit<SiteContentRow, 'id' | 'created_at' | 'updated_at'>>;

const normalizeSiteContent = (payload: SiteContentRow[] | { data?: SiteContentRow[] }) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload.data ?? [];
};

export const getSiteContents = async (): Promise<SiteContentRow[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-content`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch site content');
    }

    return normalizeSiteContent(await response.json());
};

export const createSiteContent = async (payload: CreateSiteContentPayload): Promise<SiteContentRow> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create site content');
    }

    return response.json();
};

export const updateSiteContent = async (id: string | number, payload: UpdateSiteContentPayload): Promise<SiteContentRow> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-content/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update site content');
    }

    return response.json();
};

export const deleteSiteContent = async (id: string | number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-content/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete site content');
    }
};
