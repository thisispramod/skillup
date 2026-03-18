import React, { useState, useRef, useEffect } from 'react';

const ImageUploader = ({ label, onImageSelect, existingImage }) => {
    const [preview, setPreview] = useState(existingImage || null);
    const [error, setError] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const fileInputRef = useRef(null);

    // Parse relative URLs to point to backend.
    const getImageUrl = (imagePath) => {
        if (!imagePath || imagePath === 'null') return null;
        if (imagePath instanceof File) {
            return URL.createObjectURL(imagePath);
        }
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
        // If it's already a full URL or blob, return as is
        if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) return imagePath;

        // Remove any extra slashes between url and relative path
        const trimmedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${BASE_URL.replace(/\/+$/, '')}/${trimmedPath}`;
    };

    useEffect(() => {
        if (existingImage && existingImage !== 'null') {
            setPreview(getImageUrl(existingImage));
        } else {
            setPreview(null);
        }
    }, [existingImage]);

    const validateAndProcessFile = (file) => {
        setError('');
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('File is too large! Maximum allowed size is 2MB.');
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Invalid file type! Only JPG, PNG, and WEBP are allowed.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
    };

    const handleFileChange = (e) => validateAndProcessFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsHovering(false);
        validateAndProcessFile(e.dataTransfer.files[0]);
    };

    const clearImage = () => {
        setPreview(null);
        // Passing special 'null' string to distinguish between "not updated" vs "cleared explicitly"
        onImageSelect('null');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex flex-col gap-2 mb-4 w-full">
            <label className="font-semibold text-slate-700 text-sm">{label}</label>

            {!preview ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isHovering ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:bg-slate-50'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                    onDragLeave={() => setIsHovering(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <span className="material-symbols-rounded text-slate-400 mb-2 text-3xl">image</span>
                    <span className="text-sm text-slate-500 text-center">Drag & Drop an image or <span className="text-primary-500 hover:underline">browse</span></span>
                    <span className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP up to 2MB</span>
                </div>
            ) : (
                <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50 inline-block w-fit">
                    <img src={preview} alt="Preview" className="max-h-40 max-w-full rounded object-contain" />
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-rose-600 transition-colors"
                        title="Remove image"
                    >
                        <span className="material-symbols-rounded text-sm">close</span>
                    </button>
                </div>
            )}

            {error && <span className="text-rose-500 text-xs mt-1 font-medium">{error}</span>}
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
            />
        </div>
    );
};

export default ImageUploader;
