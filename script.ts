interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const resultsContainer = document.getElementById('results') as HTMLElement;

if (!searchInput || !resultsContainer) {
    console.error('Missing search input or results container in the DOM.');
}

searchInput?.addEventListener('keyup', async () => {
    const query = searchInput.value.trim();
    console.log('User input:', query); // Debugging input value

    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/search?q=${encodeURIComponent(query)}`);
        console.log('API Response:', response); // Debugging response
        const data: Comment[] = await response.json();
        console.log('API Data:', data); // Debugging parsed JSON

        if (Array.isArray(data) && data.length > 0) {
            const resultItems = data.map(item => `<li>${item.name}</li>`).join('');
            resultsContainer.innerHTML = `<ul>${resultItems}</ul>`;
        } else {
            resultsContainer.innerHTML = '<p>No results found</p>';
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        resultsContainer.innerHTML = '<p>Error fetching results</p>';
    }
});
