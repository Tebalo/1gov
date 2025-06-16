"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchResult {
    id: string;
    name: string;
    type: string;
    status: 'Active' | 'Pending' | 'Inactive';
}

type RecordType = 'Teacher' | 'Student-Teacher' | 'Investigation' | 'Appeals' | 'Revocation';

interface SearchFormModalProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function SearchFormModal({ isOpen: controlledOpen, onOpenChange }: SearchFormModalProps = {}) {
    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const [recordType, setRecordType] = useState<RecordType | "">("");
    const [searchId, setSearchId] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Use controlled state if provided, otherwise use internal state
    const isModalOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsModalOpen = onOpenChange || setInternalOpen;

    const recordTypes: RecordType[] = [
        "Teacher",
        "Student-Teacher",
        "Investigation", 
        "Appeals",
        "Revocation"
    ];

    const handleSearch = async (e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent): Promise<void> => {
        if (e) e.preventDefault();
        if (!recordType || !searchId) return;
        
        setIsLoading(true);
        
        // Simulate API call - replace with your actual API
        try {
            console.log("Searching for:", { recordType, searchId });
            
            // Mock results for demonstration - replace with actual API call
            const mockResults: SearchResult[] = [
                { id: "001", name: "John Doe", type: recordType, status: "Active" },
                { id: "002", name: "Jane Smith", type: recordType, status: "Pending" },
                { id: "003", name: "Mike Johnson", type: recordType, status: "Inactive" }
            ];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSearchResults(mockResults);
            
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = (): void => {
        setSearchResults([]);
        setSearchId("");
        setRecordType("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleRecordTypeChange = (value: string): void => {
        setRecordType(value as RecordType);
    };

    return (
        <>
            {/* Trigger Button - only show if not controlled */}
            {controlledOpen === undefined && (
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full max-w-md mx-auto bg-white text-gray-800 hover:bg-gray-100 shadow-md flex items-center justify-center gap-2"
                >
                    <Search className="w-4 h-4 mr-2" />
                    Search Records
                </Button>
            )}

            {/* Search Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Search Records</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        {/* Search Form */}
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                {/* Record Type Dropdown */}
                                <div className="flex-shrink-0 w-48">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Record Type
                                    </label>
                                    <Select value={recordType} onValueChange={handleRecordTypeChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Teacher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {recordTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Select record type (teacher, student-teacher, investigation, appeals, revocation etc)
                                    </p>
                                </div>

                                {/* Search Input */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search by ID
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={searchId}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
                                            placeholder="Search for records by ID"
                                            className="pr-10"
                                            onKeyDown={handleKeyDown}
                                        />
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Input field to capture IDs
                                    </p>
                                </div>

                                {/* Buttons Container */}
                                <div className="flex gap-2 pt-6">
                                    <Button 
                                        onClick={handleSearch}
                                        disabled={!recordType || !searchId || isLoading}
                                        className="px-6"
                                    >
                                        {isLoading ? "Searching..." : "Search"}
                                    </Button>

                                    <Button 
                                        variant="outline"
                                        onClick={clearResults}
                                        className="px-4"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="border-2 border-gray-200 rounded-lg min-h-[300px]">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
                                    {searchResults.length > 0 && (
                                        <span className="text-sm text-gray-600">
                                            {searchResults.length} results found
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-600">Searching...</span>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="space-y-3">
                                        {searchResults.map((result: SearchResult) => (
                                            <div 
                                                key={result.id}
                                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4">
                                                        <div className="font-medium text-gray-900">
                                                            ID: {result.id}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            {result.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Type: {result.type}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        result.status === 'Active' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : result.status === 'Pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {result.status}
                                                    </span>
                                                    <Button size="sm" variant="outline">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">No results yet</p>
                                        <p className="text-sm">Select a record type and enter an ID to search</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
