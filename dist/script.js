"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keyup', () => __awaiter(void 0, void 0, void 0, function* () {
    const query = searchInput.value.trim();
    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }
    try {
        console.log(`Fetching results for query: ${query}`);
        const response = yield fetch(`http://localhost:3001/search?q=${encodeURIComponent(query)}`);
        const data = yield response.json();
        console.log('Received data:', data);
        if (Array.isArray(data) && data.length > 0) {
            const resultItems = data.map(item => `<li>${item.name}</li>`).join('');
            resultsContainer.innerHTML = `<ul>${resultItems}</ul>`;
        }
        else {
            resultsContainer.innerHTML = '<p>No results found</p>';
        }
    }
    catch (error) {
        console.error('Error fetching results:', error);
        resultsContainer.innerHTML = '<p>Error fetching results</p>';
    }
}));
