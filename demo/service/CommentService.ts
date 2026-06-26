export type CommentRow = {
    id: string | number;
    article_id?: string | number;
    author_name?: string;
    content?: string;
    created_at?: string;
    updated_at?: string;
};

export type CreateCommentPayload = {
    article_id: number;
    author_name: string;
    content: string;
    created_at?: string;
};

export type UpdateCommentPayload = Partial<Pick<CommentRow, 'author_name' | 'content'>>;

const normalizeComments = (payload: CommentRow[] | { data?: CommentRow[] }) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload.data ?? [];
};

export const getComments = async (): Promise<CommentRow[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch comments');
    }

    return normalizeComments(await response.json());
};

export const createComment = async (payload: CreateCommentPayload): Promise<CommentRow> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create comment');
    }

    return response.json();
};

export const updateComment = async (id: string | number, payload: UpdateCommentPayload): Promise<CommentRow> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update comment');
    }

    return response.json();
};

export const deleteComment = async (id: string | number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete comment');
    }
};
