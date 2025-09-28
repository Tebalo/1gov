"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchRecordResponse } from "../lib/types";
import { searchRecord } from "../lib/actions";
import Link from "next/link";

interface SearchResult {
    id: string;
    name: string;
    type: string;
    status: string;
    // Additional fields from API
    regNumber?: string;
    applicationId?: string;
    endorsementStatus?: string;
    institutionVerification?: string;
    courseVerification?: string;
    licenseStatus?: string;
    createdAt?: string;
    updatedAt?: string;
    // Store full API response for detailed operations
    fullRecord?: SearchRecordResponse;
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
        
        try {
            console.log("Searching for:", { recordType, searchId });
            
            // Call your searchRecord function
            const result = await searchRecord(searchId);
            
            if (result) {
                // Transform the API response to match your SearchResult interface
                const transformedResult: SearchResult = {
                    id: result.national_id,
                    name: result.payment_name || `${result.registration_type} - ${result.reg_number}`,
                    type: result.registration_type,
                    status: result.reg_status,
                    
                    regNumber: result.reg_number,
                    applicationId: result.application_id,
                    endorsementStatus: result.endorsement_status,
                    institutionVerification: result.institution_verification,
                    courseVerification: result.course_verification,
                    licenseStatus: result.license_status,
                    createdAt: result.created_at,
                    updatedAt: result.updated_at,
                    
                    fullRecord: result
                };
                
                // Add to existing results or replace - depending on your needs
                setSearchResults(prev => [transformedResult, ...prev]); // Adds to beginning
                // OR replace all results:
                // setSearchResults([transformedResult]);
                
                console.log("Search successful:", transformedResult);
            } else {
                // No results found
                setSearchResults([]);
                console.log("No results found for:", searchId);
                
                // Optional: Show a toast/notification
                // toast.info("No records found matching your search criteria");
            }
            
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
            
            // Optional: Show error toast/notification
            // toast.error("Search failed. Please try again.");
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
            {/* {controlledOpen === undefined && (
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full max-w-md mx-auto bg-white text-gray-800 border-spacing-2 hover:border-spacing-3 hover:bg-inherit flex items-center justify-center gap-2"
                >
                    <Search className="w-4 h-4 mr-2" />
                    Search Records
                </Button>
            )} */}
            {controlledOpen === undefined && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105",
                        "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    )}
                >
                    {/* Icon */}
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <Search size={24} color="currentColor" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className={cn(
                        "absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none transition-all duration-300 whitespace-nowrap z-50",
                        "group-hover:opacity-100 group-hover:translate-x-1"
                    )}>
                        Search
                        {/* Tooltip arrow */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>

                    <span className="sr-only">Search</span>
                </button>
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
                                            <SelectValue placeholder="Select record" />
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
                                        //disabled
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
                                                            {result.id}
                                                        </div>
                                                        {/* <div className="text-gray-600">
                                                            {result.name}
                                                        </div> */}
                                                        <div className="font-medium text-gray-500">
                                                            {result.type}
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
                                                    <Link href={`/trls/work/teacher/${result.id}`}>
                                                        <Button 
                                                            size="sm" 
                                                            className="group bg-blue-600 hover:bg-blue-700 text-white px-6"
                                                            onClick={() => setIsModalOpen(false)}
                                                        >
                                                            View Details
                                                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
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
