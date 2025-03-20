'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchDockerContainers } from './connect-REST/api';
import { Check, ChevronsUpDown, Filter, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";


export default function DockerContainersPage() {
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [showOnlyRunning, setShowOnlyRunning] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [openProjectDropdown, setOpenProjectDropdown] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    async function loadContainers() {
      try {
        const data = await fetchDockerContainers();
        setContainers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadContainers();
  }, []);

  // Calculate unique projects from container labels
  const projects = useMemo(() => {
    const projectSet = new Set<string>();
    containers.forEach(container => {
      if (container.Labels && container.Labels["com.docker.compose.project"]) {
        projectSet.add(container.Labels["com.docker.compose.project"]);
      }
    });
    return Array.from(projectSet).sort();
  }, [containers]);

  // Calculate unique statuses from containers
  const statuses = useMemo(() => {
    const statusSet = new Set<string>();
    containers.forEach(container => {
      if (container.Status) {
        // Extract the first part of the status (e.g. "Up" from "Up 2 days")
        // const statusPrefix = container.Status.split(' ')[0];
        const statusPrefix = container.Status;
        statusSet.add(statusPrefix);
      }
    });
    return Array.from(statusSet).sort();
  }, [containers]);

  // Apply filters
  const filteredContainers = useMemo(() => {
    let count = 0;
    
    let filtered = containers.filter(container => {
      // Filter by running state
      if (showOnlyRunning && container.State !== 'running') {
        return false;
      }
      
      // Filter by project
      if (selectedProject && (!container.Labels || container.Labels["com.docker.compose.project"] !== selectedProject)) {
        return false;
      }
      
      // Filter by status prefix
      if (statusFilter && !container.Status.toLowerCase().includes(statusFilter.toLowerCase())) {
        return false;
      }
      
      // Search by name or image
      if (searchTerm) {
        const containerName = container.Names[0]?.toLowerCase() || '';
        const imageName = container.Image.toLowerCase();
        return containerName.includes(searchTerm.toLowerCase()) || 
               imageName.includes(searchTerm.toLowerCase());
      }
      
      return true;
    });

    // Calculate active filters count
    let filtersCount = 0;
    if (showOnlyRunning) filtersCount++;
    if (selectedProject) filtersCount++;
    if (statusFilter) filtersCount++;
    if (searchTerm) filtersCount++;
    
    setActiveFiltersCount(filtersCount);
    
    return filtered;
  }, [containers, showOnlyRunning, selectedProject, statusFilter, searchTerm]);

  // Helper function to format container name (remove leading slash)
  const formatContainerName = (name: string) => {
    return name.startsWith('/') ? name.substring(1) : name;
  };

  // Helper function to get status badge color based on container state
  const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exited':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Helper function to extract port mappings in readable format
  const formatPorts = (ports: DockerContainer['Ports']) => {
    if (!ports || ports.length === 0) return 'None';
    
    return ports.map(port => {
      if (port.PublicPort) {
        return `${port.PublicPort}:${port.PrivatePort}/${port.Type}`;
      }
      return `${port.PrivatePort}/${port.Type}`;
    }).join(', ');
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setShowOnlyRunning(false);
    setSelectedProject("");
    setStatusFilter("");
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg bg-white shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading docker containers...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the latest data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg bg-white shadow-md border-l-4 border-red-500 max-w-lg">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">Error Loading Containers</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Docker Containers</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
            >
              <X size={16} /> Clear Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
          <p className="text-gray-600">
            Showing {filteredContainers.length} of {containers.length} container{containers.length !== 1 ? 's' : ''}
          </p>
        </header>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Filter containers by state, project, and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Running State Filter */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="running-mode" 
                  checked={showOnlyRunning} 
                  onCheckedChange={setShowOnlyRunning}
                />
                <Label htmlFor="running-mode">Running Containers Only</Label>
              </div>

              {/* Project Filter */}
              <div className="space-y-1">
                <Label>Project</Label>
                <Popover open={openProjectDropdown} onOpenChange={setOpenProjectDropdown}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProjectDropdown}
                      className="w-full justify-between"
                    >
                      {selectedProject
                        ? selectedProject
                        : "Select project..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search projects..." />
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((project) => (
                          <CommandItem
                            key={project}
                            value={project}
                            onSelect={(currentValue) => {
                              setSelectedProject(currentValue === selectedProject ? "" : currentValue);
                              setOpenProjectDropdown(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProject === project ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {project}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <Label>Duration</Label>
                <Popover open={openStatusDropdown} onOpenChange={setOpenStatusDropdown}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openStatusDropdown}
                      className="w-full justify-between"
                    >
                      {statusFilter || "Select status..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search statuses..." />
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status}
                            value={status}
                            onSelect={(currentValue) => {
                              setStatusFilter(currentValue === statusFilter ? "" : currentValue);
                              setOpenStatusDropdown(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                statusFilter === status ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {status}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Filter */}
              <div className="space-y-1">
                <Label>Search</Label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or image..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredContainers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-700">No containers match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContainers.map((container) => (
              <Card key={container.Id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl truncate" title={formatContainerName(container.Names[0])}>
                      {formatContainerName(container.Names[0])}
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(container.State)} border`}>
                      {container.State}
                    </span>
                  </div>
                  <CardDescription className="mt-1">{container.Status}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {container.Labels["com.docker.compose.project"] && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">PROJECT</p>
                      <Badge variant="outline" className="mt-1">
                        {container.Labels["com.docker.compose.project"]}
                      </Badge>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">IMAGE</p>
                    <p className="text-gray-800 truncate" title={container.Image}>{container.Image}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">CREATED</p>
                      <p className="text-gray-800">{formatTimestamp(container.Created)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">PORTS</p>
                      <p className="text-gray-800 text-sm">{formatPorts(container.Ports)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">NETWORK</p>
                    <p className="text-gray-800">{container.HostConfig.NetworkMode}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">IP ADDRESS</p>
                    <p className="text-gray-800">
                      {Object.values(container.NetworkSettings.Networks)[0]?.IPAddress || 'None'}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between py-3">
                  <Button variant="outline" size="sm" className="text-blue-600">
                    Details
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-gray-600">
                        Logs
                      </Button> 
                    </DialogTrigger>
                    <DialogContent className="w-64">
                      <DialogHeader>
                        <DialogTitle>Container logs</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        See container logs here
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" className="text-yellow-600">
                      Restart
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      {container.State === 'running' ? 'Stop' : 'Start'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}