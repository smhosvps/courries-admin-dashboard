/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  SkipForward,
  ArrowLeft // Add this icon
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUploadUsersCSVMutation } from '@/redux/features/user/userApi';

export default function UploadUsersCSV() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadUsersCSV, { isLoading }] = useUploadUsersCSVMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        e.target.value = '';
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const result = await uploadUsersCSV(formData).unwrap();
      setUploadResult(result);

      // Show appropriate toast based on results
      if (result.summary.created > 0) {
        toast.success(`Successfully created ${result.summary.created} users`);
      }
      if (result.summary.skipped > 0) {
        toast.info(`${result.summary.skipped} users skipped (already exist)`);
      }
      if (result.summary.failed > 0) {
        toast.error(`${result.summary.failed} records failed`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload CSV');
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
      'userType',
      'dateOfBirth',
      'gender',
      'adminRiders'
    ].join(',');

    const sampleRow = [
      'John',
      'Doe',
      'john.doe@example.com',
      '+2348123456789',
      'delivery_partner',
      '1990-01-01',
      'Male',
      'Yes',
      ''
    ].join(',');

    const csv = `${headers}\n${sampleRow}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Navigation functions
  const goBack = () => {
    navigate(-1); // This goes back to the previous page in history
  };

  const goToUserManagement = () => {
    navigate('/dashboard/manage-user');
  };

  return (
    <div className="container mx-auto p-0 py-4 lg:px-8">
      {/* Back Navigation Bar */}
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[6px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="text-sm text-gray-500">|</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToUserManagement}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[6px]"
        >
          User Management
        </Button>
      </div>

      <Card className="border-blue-100 bg-white/80">
        <CardHeader className="border-b border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Optional: Add a back button in header as alternative */}
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="h-8 w-8 rounded-full hover:bg-gray-100"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl text-blue-600">
                Upload Users via CSV
              </CardTitle>
            </div>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2 rounded-full"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Upload Section */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <div className="mb-4">
                <Label
                  htmlFor="csv-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Select CSV File
                </Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {file && (
                <div className="mt-4 p-4 bg-gray-50 rounded-[12px">
                  <p className="text-sm text-gray-600">
                    Selected: <span className="font-semibold">{file.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-4">
                Upload a CSV file. Existing emails/phones will be skipped automatically.
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end gap-4 mb-8">
            <Button
              type="button"
              variant="outline"
              className='rounded-full'
              onClick={goBack} // Changed to goBack
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload and Process
            </Button>
          </div>

          {/* Results Section */}
          {uploadResult && (
            <div className="mt-8 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Records</p>
                  <p className="text-2xl font-bold">{uploadResult.summary.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Created</p>
                  <p className="text-2xl font-bold">{uploadResult.summary.created}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Skipped (Existing)</p>
                  <p className="text-2xl font-bold">{uploadResult.summary.skipped}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Failed</p>
                  <p className="text-2xl font-bold">{uploadResult.summary.failed}</p>
                </div>
              </div>

              {/* Action Buttons after upload */}
              {uploadResult && (
                <div className="flex justify-end gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={goBack}
                    className="flex items-center gap-2 rounded-[6px]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setFile(null);
                      setUploadResult(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-[6px]"
                  >
                    Upload Another File
                  </Button>
                </div>
              )}

              {/* Created Users */}
              {uploadResult.data.created.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Created Users ({uploadResult.data.created.length})
                  </h4>
                  <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadResult.data.created.map((user: any) => (
                          <TableRow key={user._id}>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.userType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Skipped Users (Existing) */}
              {uploadResult.data.skipped.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-600">
                    <SkipForward className="h-5 w-5" />
                    Skipped - Already Exist ({uploadResult.data.skipped.length})
                  </h4>
                  <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadResult.data.skipped.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.row}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.phone}</TableCell>
                            <TableCell>{item.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Errors */}
              {uploadResult.data.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    Failed Records ({uploadResult.data.errors.length})
                  </h4>
                  <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadResult.data.errors.map((error: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.email}</TableCell>
                            <TableCell className="text-red-600">{error.error}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}