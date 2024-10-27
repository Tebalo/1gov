"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { roleObjects } from '@/app/lib/store';

interface RolePermissions {
    reg_application: boolean;
    lic_application: boolean;
    inv_application: boolean;
    reg_Next_Status: string | null;
    inv_Next_Status: string | null;
    tipoff_Next_Status: string | null;
    lic_Next_Status: string | null;
    defaultWork: string;
}

interface RoleObjects {
    [key: string]: RolePermissions;
}

const RolePermissionsForm = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [formData, setFormData] = useState<RolePermissions>({
    reg_application: false,
    lic_application: false,
    inv_application: false,
    reg_Next_Status: null,
    inv_Next_Status: null,
    tipoff_Next_Status: null,
    lic_Next_Status: null,
    defaultWork: ''
  });

  const statusOptions = [
    'Pending-Screening',
    'Pending-Assessment',
    'Under-Review',
    'Assessment',
    'Pending-Manager-Approval',
    'Pending-Endorsement',
    'Endorsement-Recommendation',
    'Registered',
    'Incoming'
  ];

  const workOptions = [
    'RegistrationApplication',
    'Investigations',
    'licenseApplication'
  ];

  const formatRoleName = (role: string): string => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setFormData(roleObjects[role]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated role permissions:', { [selectedRole]: formData });
  };

  return (
    <div className="flex gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-2rem)]">
      {/* Left Side - Role Selection */}
      <Card className="w-1/4 min-w-[250px]">
        <CardHeader>
          <CardTitle>Select Persona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md h-[calc(100vh-12rem)] overflow-y-auto bg-white">
            <div className="divide-y">
              {Object.keys(roleObjects).map((role) => (
                <div 
                  key={role}
                  className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedRole === role ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleRoleChange(role)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{formatRoleName(role)}</span>
                    {selectedRole === role && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Side - Settings Form */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {selectedRole ? `${formatRoleName(selectedRole)} Settings` : 'Role Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRole ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Permissions Section */}
                <div className="space-y-4">
                  <h3 className="font-medium">Permissions</h3>
                  <div className="bg-white rounded-md border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Registration Application</label>
                      <Switch 
                        checked={formData.reg_application}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, reg_application: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">License Application</label>
                      <Switch 
                        checked={formData.lic_application}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, lic_application: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Investigation Application</label>
                      <Switch 
                        checked={formData.inv_application}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, inv_application: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Default Work Section */}
                <div className="space-y-4">
                  <h3 className="font-medium">Default Work</h3>
                  <div className="border rounded-md h-40 overflow-y-auto bg-white">
                    <div className="divide-y">
                      {workOptions.map((work) => (
                        <div 
                          key={work}
                          className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                            formData.defaultWork === work ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, defaultWork: work }))}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{formatRoleName(work)}</span>
                            {formData.defaultWork === work && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Status Settings */}
              <div className="space-y-4">
                <h3 className="font-medium">Next Status Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Registration Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Next Status</label>
                    <div className="border rounded-md h-40 overflow-y-auto bg-white">
                      <div className="divide-y">
                        {statusOptions.map((status) => (
                          <div 
                            key={status}
                            className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                              formData.reg_Next_Status === status ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              reg_Next_Status: status 
                            }))}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{status}</span>
                              {formData.reg_Next_Status === status && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* License Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">License Next Status</label>
                    <div className="border rounded-md h-40 overflow-y-auto bg-white">
                      <div className="divide-y">
                        {statusOptions.map((status) => (
                          <div 
                            key={status}
                            className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                              formData.lic_Next_Status === status ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              lic_Next_Status: status 
                            }))}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{status}</span>
                              {formData.lic_Next_Status === status && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Investigation Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Investigation Next Status</label>
                    <div className="border rounded-md h-40 overflow-y-auto bg-white">
                      <div className="divide-y">
                        {statusOptions.map((status) => (
                          <div 
                            key={status}
                            className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                              formData.inv_Next_Status === status ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              inv_Next_Status: status 
                            }))}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{status}</span>
                              {formData.inv_Next_Status === status && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tipoff Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipoff Next Status</label>
                    <div className="border rounded-md h-40 overflow-y-auto bg-white">
                      <div className="divide-y">
                        {statusOptions.map((status) => (
                          <div 
                            key={status}
                            className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                              formData.tipoff_Next_Status === status ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              tipoff_Next_Status: status 
                            }))}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{status}</span>
                              {formData.tipoff_Next_Status === status && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setSelectedRole('');
                    setFormData({
                      reg_application: false,
                      lic_application: false,
                      inv_application: false,
                      reg_Next_Status: null,
                      inv_Next_Status: null,
                      tipoff_Next_Status: null,
                      lic_Next_Status: null,
                      defaultWork: ''
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Role
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a role to view and edit settings
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePermissionsForm;