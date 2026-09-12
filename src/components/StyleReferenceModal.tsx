import React, { useState } from 'react';
import { ThemePreset } from '../types';
import { themeStyles } from '../utils/helpers';
import { X, Palette, Upload, Image as ImageIcon, Check, Sliders } from 'lucide-react';

interface StyleReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemePreset;
  onSelectTheme: (theme: ThemePreset) => void;
  referenceImage: string | null;
  onSetReferenceImage: (dataUrl: string | null) => void;
}

export const StyleReferenceModal: React.FC<StyleReferenceModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  referenceImage,
  onSetReferenceImage,
}) => {
  if (!isOpen) return null;

  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onSetReferenceImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const presets: { id: ThemePreset; name: string; desc: string; sampleBg: string; sampleAccent: string }[] = [
    {
      id: 'warm-amber',
      name: 'Warm Amber & Honey (Rover / MoeGo Style)',
      desc: 'Warm golden amber accents, friendly check-in tags, welcoming and comfortable pet sitting atmosphere.',
      sampleBg: 'bg-amber-50',
      sampleAccent: 'bg-amber-600',
    },
    {
      id: 'sage-mint',
      name: 'Fresh Park Sage & Mint (Outdoor Visit Style)',
      desc: 'Fresh botanical emerald & sage, calm outdoor walk atmosphere, high legibility.',
      sampleBg: 'bg-emerald-50',
      sampleAccent: 'bg-emerald-700',
    },
    {
      id: 'luxe-slate',
      name: 'Modern Indigo & Slate (Time To Pet Style)',
      desc: 'Professional Time To Pet / Pro Sitter aesthetic with clean slate-900 accents.',
      sampleBg: 'bg-slate-100',
      sampleAccent: 'bg-slate-900',
    },
    {
      id: 'rose-terracotta',
      name: 'Cozy Hearth Terracotta (In-Home Sitter Style)',
      desc: 'Warm terracotta clay tones, cozy home atmosphere for overnight sitting and visits.',
      sampleBg: 'bg-orange-50',
      sampleAccent: 'bg-stone-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-2xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Visual Style & Reference Matching
              </h2>
              <p className="text-xs text-stone-500">
                Switch app color theme or upload your current software screenshot to match
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Theme Presets */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
              Preset Color & Design Themes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => onSelectTheme(preset.id)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                    currentTheme === preset.id
                      ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${preset.sampleAccent}`} />
                        <span className="font-bold text-xs text-stone-900">{preset.name}</span>
                      </div>
                      {currentTheme === preset.id && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white text-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                      {preset.desc}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    <span className={`h-2.5 flex-1 rounded ${preset.sampleBg}`} />
                    <span className={`h-2.5 w-8 rounded ${preset.sampleAccent}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Image Inspector / Upload */}
          <div className="border-t border-stone-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Current Software Reference Screenshot
              </h3>
              {referenceImage && (
                <button
                  type="button"
                  onClick={() => onSetReferenceImage(null)}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Remove Screenshot
                </button>
              )}
            </div>
            <p className="text-xs text-stone-500 mb-3">
              If you have a screenshot of your current appointment system (e.g. MoeGo, Gingr, Google Calendar, or paper planner), drop it here to inspect side-by-side!
            </p>

            {referenceImage ? (
              <div className="rounded-xl border border-stone-200 p-3 bg-stone-50">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    Reference Image Attached
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">Active Reference</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-stone-200 bg-white max-h-64 flex items-center justify-center">
                  <img
                    src={referenceImage}
                    alt="Reference Screenshot"
                    className="max-h-64 object-contain"
                  />
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-stone-200 bg-stone-50 hover:bg-stone-100/50'
                }`}
              >
                <Upload className="w-8 h-8 text-stone-400 mb-2" />
                <p className="text-xs font-semibold text-stone-700">
                  Drag and drop your reference screenshot here
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Supports PNG, JPG, WEBP (stored locally in browser)
                </p>
                <label className="mt-3 cursor-pointer rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-900"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
