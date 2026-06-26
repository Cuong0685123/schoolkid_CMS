export type NewsArticleRow = {
    id: string | number;
    title?: string;
    slug?: string;
    thumbnail_url?: string;
    content?: string;
    author_name?: string;
    published_at?: string;
    created_at?: string;
    updated_at?: string;
};

export type NewsArticlePayload = Partial<Pick<NewsArticleRow, 'title' | 'slug' | 'thumbnail_url' | 'content' | 'author_name' | 'published_at'>>;

const normalizeNewsArticles = (payload: NewsArticleRow[] | { data?: NewsArticleRow[] }) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload.data ?? [];
};

export const getNewsArticles = async (): Promise<NewsArticleRow[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news-articles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch news articles');
    }

    return normalizeNewsArticles(await response.json());
};

export const createNewsArticle = async (payload: NewsArticlePayload): Promise<NewsArticleRow> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news-articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create news article');
    }

    return response.json();
};

export const updateNewsArticle = async (id: string | number, payload: NewsArticlePayload): Promise<NewsArticleRow> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news-articles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update news article');
    }

    return response.json();
};

export const deleteNewsArticle = async (id: string | number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news-articles/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete news article');
    }
};
