
export const getPrograms = async () => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/programs`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch programs')
    }

    return response.json()
}

export const createProgram = async () => {}

export const updateProgram = async () => {}

export const deleteProgram = async () => {}