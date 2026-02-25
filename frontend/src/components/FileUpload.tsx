import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
    label: string;
    value: string | null;
    onChange: (url: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, value, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Max size is 5MB.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`, {
                method: 'POST',
                body: formData,
                // Authentication header if needed? 
                // Our backend simple auth uses 'x-admin-key' if env ADMIN_KEY is set.
                // We'll assume the simple auth for now.
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            if (result.success) {
                onChange(result.data);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>

            <div className="relative">
                {value ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-secondary">
                        <img
                            src={value}
                            alt="Preview"
                            className="h-full w-full object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/80 text-white backdrop-blur-sm transition-colors hover:bg-destructive"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary transition-colors hover:border-primary/50 hover:bg-secondary/80 ${uploading ? 'pointer-events-none opacity-60' : ''}`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-xs text-muted-foreground">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Upload size={20} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-medium text-foreground">Click to upload image</p>
                                    <p className="text-[10px] text-muted-foreground">JPG, PNG, WEBP (Max 5MB)</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default FileUpload;
