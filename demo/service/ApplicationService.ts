export type ApplicationRow = {
    id: string | number;
    parent_name?: string;
    parent_email?: string;
    parent_phone?: string;
    child_name?: string;
    child_age?: number;
    program_id?: number;
    message?: string;
    submitted_at?: string;
    status?: string;
};

export type UpdateApplicationPayload = Partial<Omit<ApplicationRow, 'id'>>;

export const getApplications = async (): Promise<ApplicationRow[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch applications');
    }

    return response.json();
};

export const updateApplication = async (id: string | number, payload: UpdateApplicationPayload): Promise<ApplicationRow> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update application');
    }

    return response.json();
};