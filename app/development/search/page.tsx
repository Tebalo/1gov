"use client"
import React, { useState } from 'react';

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);

    const handleSearch = async () => {
        // Simulate a search operation
        const mockResults = ['Result 1', 'Result 2', 'Result 3'].filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        setResults(mockResults);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Search Page</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter search query"
                    style={{ padding: '10px', width: '300px' }}
                />
                <button onClick={handleSearch} style={{ padding: '10px 20px', marginLeft: '10px' }}>
                    Search
                </button>
            </div>
            <div>
                <h2>Results:</h2>
                {results.length > 0 ? (
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;