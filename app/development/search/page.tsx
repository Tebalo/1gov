"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, Sparkles } from 'lucide-react';
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
        <div className='bg-white p-10 space-y-10'>
            <div className='flex items-center space-x-2 justify-center'>  
                <div className='flex-1 w-64'>
                    <Input
                    type='text'
                    placeholder='Search for teacher reg, appeal, CPD, student-teacher reg, investigation etc'
                    className='rounded-full'
                    />
                </div>    
                <div className='flex-none w-16'>
                    <Button 
                    onClick={handleSearch} 
                    className='text-white rounded-full'
                    variant={'secondary'}
                    >
                        <Search className='text-gray-500' />
                    </Button>
                </div>
            </div>
            <div className='flex items-center space-x-2 justify-center'>
                <div className='flex-none w-64'>
                    <Label className='font-bold'>Filter</Label>
                    <Accordion type="single" collapsible defaultValue='item-1' className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Case type</AccordionTrigger>
                            <AccordionContent>
                                <RadioGroup defaultValue="all">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all" />
                                        <Label htmlFor="all">All Work</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="teacher" id="teacher" />
                                        <Label htmlFor="teacher">Teacher registration</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="student-teacher" id="student-teacher" />
                                        <Label htmlFor="student-teacher">Student-teacher registration</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="appeal" id="appeal" />
                                        <Label htmlFor="appeal">Appeal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="cpd" id="cpd" />
                                        <Label htmlFor="cpd">CPD</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="investigation" id="investigation" />
                                        <Label htmlFor="investigation">Investigation</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="change of category" id="change-of-category" />
                                        <Label htmlFor="change of category">Change of category</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="restoration" id="restoration" />
                                        <Label htmlFor="restoration">Restoration</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="revocation" id="revocation" />
                                        <Label htmlFor="revocation">Revocation</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="renewal" id="renewal" />
                                        <Label htmlFor="renewal">Renewal</Label>
                                    </div>
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Work status</AccordionTrigger>
                            <AccordionContent>
                                <RadioGroup defaultValue="all">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all" />
                                        <Label htmlFor="all">All</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="new" id="new" />
                                        <Label htmlFor="new">New</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="open" id="open" />
                                        <Label htmlFor="open">Open</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="resolved" id="resolved" />
                                        <Label htmlFor="resolved">Resolved</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="closed" id="closed" />
                                        <Label htmlFor="closed">Closed</Label>
                                    </div>
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Work type</AccordionTrigger>
                            <AccordionContent>
                                <RadioGroup defaultValue='all'>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all" />
                                        <Label htmlFor="all">All Work</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all-unresolved-work" id="all-unresolved-work" />
                                        <Label htmlFor="all-unresolved-work">All unresolved work</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="work-created-by-me" id="work-created-by-me" />
                                        <Label htmlFor="work-created-by-me">Work created by me</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="work-last-updated-by-me" id="work-last-updated-by-me" />
                                        <Label htmlFor="work-last-updated-by-me">Work last updated by me</Label>
                                    </div>
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className='flex-1 w-72 flex items-center space-x-2 justify-center'>
                    <Sparkles/>
                    <h5>No results</h5>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;