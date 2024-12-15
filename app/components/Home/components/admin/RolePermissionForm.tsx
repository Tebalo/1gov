"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ROLES } from '@/app/lib/store';

type RoleType = keyof typeof ROLES;
type GroupedPermissions = {
  [key: string]: string[]
}

const RolePermissionsForm = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setSelectedPermissions([...ROLES[role]]);
  };

  const groupPermissions = (permissions: readonly string[]): GroupedPermissions => {
    return [...permissions].reduce((acc, permission) => {
      const [action, category] = permission.split(':');
      const rawCategory = category?.split('-')[0] || 'other';
      
      // Create key based on action type and category
      const key = `${rawCategory}_${action}`;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(permission);
      
      return acc;
    }, {} as GroupedPermissions);
  };

  const formatPermissionName = (permission: string): string => {
    return permission
      .split(':')[1]
      ?.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || permission;
  };

  const formatRoleName = (role: string): string => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      console.log('Updated role permissions:', { 
        role: selectedRole, 
        permissions: selectedPermissions 
      });
    }
  };

  return (
    <div className="flex gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-2rem)]">
      <Card className="w-1/4 min-w-[250px]">
        <CardHeader>
          <CardTitle>Select Role</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-1">
              {(Object.keys(ROLES) as RoleType[]).map((role) => (
                <div 
                  key={role}
                  className={`p-3 cursor-pointer rounded-md transition-colors hover:bg-gray-50 ${
                    selectedRole === role ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  onClick={() => handleRoleChange(role)}
                >
                  {formatRoleName(role)}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {selectedRole ? `${formatRoleName(selectedRole)} Permissions` : 'Select a role to view permissions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRole ? (
            <form onSubmit={handleSubmit}>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-6 pr-4">
                  {Object.entries(groupPermissions(ROLES[selectedRole])).map(([category, permissions]) => {
                    const [area, action] = category.split('_');
                    
                    return (
                      <div key={category} className="space-y-4">
                        <h3 className="font-semibold capitalize">
                          {area} - {action === 'view' ? 'View Permissions' : 'Update Permissions'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {permissions.map((permission) => (
                            <div
                              key={permission}
                              className={`flex items-start space-x-3 p-3 rounded-md border bg-white
                                ${action === 'view' ? 'border-blue-100' : 'border-green-100'}`}
                            >
                              <Checkbox
                                id={permission}
                                checked={selectedPermissions.includes(permission)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPermissions(prev => [...prev, permission]);
                                  } else {
                                    setSelectedPermissions(prev => prev.filter(p => p !== permission));
                                  }
                                }}
                              />
                              <label
                                htmlFor={permission}
                                className={`text-sm leading-none 
                                  ${action === 'view' ? 'text-blue-700' : 'text-green-700'}`}
                              >
                                {formatPermissionName(permission)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setSelectedRole(null);
                    setSelectedPermissions([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Permissions
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a role to view and edit permissions
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePermissionsForm;