import React, { useEffect, useMemo, useState } from 'react';
import { Palette, Check, RotateCcw, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme, applyTheme } from '../../context/ThemeContext';
import { themePresets, DEFAULT_THEME } from '../../constants/themePresets';
import { contentService } from '../../services/contentService';
import { StoreTheme, ThemeColors, ThemeTypography, ThemePreset } from '../../types';

interface ThemeSettingsProps {
    isEmbedded?: boolean;
}

const COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
    { key: 'primary', label: 'Primary' },
    { key: 'primaryDark', label: 'Primary Dark' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'background', label: 'Page Background' },
    { key: 'surface', label: 'Cards / Surface' },
    { key: 'border', label: 'Borders' },
    { key: 'text', label: 'Body Text' },
    { key: 'textMuted', label: 'Muted Text' },
    { key: 'sage', label: 'Sage (Highlights)' },
    { key: 'earth', label: 'Earth (Deep Accent)' },
    { key: 'success', label: 'Success' },
    { key: 'danger', label: 'Danger' },
];

const SWATCH_KEYS: (keyof ThemeColors)[] = ['primary', 'secondary', 'accent', 'background', 'sage'];

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ isEmbedded = false }) => {
    const { theme, updateTheme } = useTheme();

    // Presets: local constant first (instant + always available), enriched/overridden by the API when it responds
    const [apiPresets, setApiPresets] = useState<Record<string, ThemePreset>>({});
    const presets = useMemo(() => ({ ...themePresets, ...apiPresets }), [apiPresets]);

    // Working state — never null, so editing/saving always works
    const [draftColors, setDraftColors] = useState<ThemeColors>({ ...DEFAULT_THEME.colors });
    const [draftTypography, setDraftTypography] = useState<ThemeTypography>({ ...DEFAULT_THEME.typography });
    const [activePreset, setActivePreset] = useState<string>(DEFAULT_THEME.preset);
    const [isCustom, setIsCustom] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    // Adopt the loaded theme into drafts (only when not mid-edit)
    useEffect(() => {
        if (theme && !dirty) {
            setDraftColors({ ...theme.colors });
            setDraftTypography({ ...theme.typography });
            setActivePreset(theme.preset || 'default');
            setIsCustom(!!theme.isCustom);
        }
    }, [theme, dirty]);

    // Presets from API (optional — local presets already cover the gallery)
    useEffect(() => {
        contentService
            .getThemePresets()
            .then(setApiPresets)
            .catch(() => { /* local presets are the fallback */ });
    }, []);

    /** Live preview of the merged draft without saving */
    const preview = (colors?: ThemeColors, typography?: ThemeTypography) => {
        const merged: StoreTheme = {
            preset: activePreset,
            isCustom: true,
            colors: { ...draftColors, ...colors },
            typography: { ...draftTypography, ...typography },
        };
        applyTheme(merged);
    };

    const applyPreset = async (id: string) => {
        setSaving(true);
        try {
            const fresh = await updateTheme({ preset: id, isCustom: false });
            setDraftColors({ ...fresh.colors });
            setDraftTypography({ ...fresh.typography });
            setActivePreset(id);
            setIsCustom(false);
            setDirty(false);
            toast.success(`Theme "${presets[id]?.name || id}" applied store-wide!`);
        } catch (err: any) {
            // Server unreachable — still show the preset locally so the admin sees it
            const p = presets[id];
            if (p) {
                applyTheme({ preset: id, isCustom: false, colors: p.colors, typography: p.typography });
                setDraftColors({ ...p.colors });
                setDraftTypography({ ...p.typography });
                setActivePreset(id);
                setIsCustom(false);
                setDirty(true);
                toast.error('Server unreachable — press "Save & Apply" to retry saving this theme.');
            } else {
                toast.error(err?.response?.data?.message || 'Failed to apply theme');
            }
        }
        setSaving(false);
    };

    const saveCustom = async () => {
        setSaving(true);
        try {
            const fresh = await updateTheme({
                colors: draftColors,
                typography: draftTypography,
                isCustom: true,
            });
            setActivePreset(fresh.preset || activePreset);
            setIsCustom(true);
            setDirty(false);
            toast.success('Custom theme saved and applied store-wide!');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Could not reach the server. Is the backend running with the new theme routes?');
        }
        setSaving(false);
    };

    const resetToDefault = async () => {
        await applyPreset('default');
    };

    return (
        <div className={`space-y-8 ${isEmbedded ? '' : 'animate-in fade-in duration-700 max-w-7xl mx-auto'}`}>
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-600 text-white">
                        <Palette className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Store Theme</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Pick a preset or craft custom colors &amp; fonts — changes apply to the entire store instantly.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                        Active: {presets[activePreset]?.name || activePreset}
                    </span>
                    {isCustom && (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider">
                            Customized
                        </span>
                    )}
                    {dirty && (
                        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                            Unsaved changes
                        </span>
                    )}
                </div>
                {!theme && (
                    <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium">
                            The saved theme could not be loaded from the server — showing the built-in default.
                            Make sure the backend is running with the new theme routes (restart / redeploy it).
                        </p>
                    </div>
                )}
            </div>

            {/* Presets */}
            <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Theme Presets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Object.entries(presets).map(([id, preset]) => {
                        const isActive = activePreset === id && !dirty && !isCustom;
                        return (
                            <button
                                key={id}
                                onClick={() => applyPreset(id)}
                                disabled={saving}
                                className={`text-left p-6 rounded-[2rem] border-2 transition-all duration-300 disabled:opacity-60 ${
                                    isActive
                                        ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100'
                                        : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{preset.name}</p>
                                    {isActive && (
                                        <span className="flex items-center gap-1 text-indigo-600 text-xs font-bold uppercase">
                                            <Check className="w-4 h-4" /> Active
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {SWATCH_KEYS.map((k) => (
                                        <span
                                            key={k}
                                            title={k}
                                            className="w-7 h-7 rounded-full border border-black/10 shadow-sm"
                                            style={{ backgroundColor: preset.colors[k] }}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                                    {preset.typography.headingFont.split(',')[0].replace(/['"]/g, '')} · {preset.typography.fontFamily.split(',')[0].replace(/['"]/g, '')}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Custom colors */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Custom Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {COLOR_FIELDS.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                            <input
                                type="color"
                                value={(draftColors[key] || '#000000').slice(0, 7)}
                                onChange={(e) => {
                                    const next = { ...draftColors, [key]: e.target.value };
                                    setDraftColors(next);
                                    setDirty(true);
                                    preview(next);
                                }}
                                className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="min-w-0">
                                <span className="block text-xs font-bold text-slate-700 truncate">{label}</span>
                                <span className="block text-[10px] text-slate-400 font-mono uppercase">{draftColors[key]}</span>
                            </span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Typography */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Typography</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="block">
                        <span className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Body Font (Google Fonts name)</span>
                        <input
                            type="text"
                            value={draftTypography.fontFamily}
                            onChange={(e) => {
                                const next = { ...draftTypography, fontFamily: e.target.value };
                                setDraftTypography(next);
                                setDirty(true);
                                preview(undefined, next);
                            }}
                            placeholder="'Manrope', Arial, sans-serif"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                        />
                    </label>
                    <label className="block">
                        <span className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Heading Font (Google Fonts name)</span>
                        <input
                            type="text"
                            value={draftTypography.headingFont}
                            onChange={(e) => {
                                const next = { ...draftTypography, headingFont: e.target.value };
                                setDraftTypography(next);
                                setDirty(true);
                                preview(undefined, next);
                            }}
                            placeholder="'Playfair Display', Georgia, serif"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                        />
                    </label>
                    <label className="block">
                        <span className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Base Font Size</span>
                        <input
                            type="text"
                            value={draftTypography.baseFontSize}
                            onChange={(e) => {
                                const next = { ...draftTypography, baseFontSize: e.target.value };
                                setDraftTypography(next);
                                setDirty(true);
                                preview(undefined, next);
                            }}
                            placeholder="16px"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                        />
                    </label>
                    <label className="block">
                        <span className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Corner Radius</span>
                        <input
                            type="text"
                            value={draftTypography.borderRadius}
                            onChange={(e) => {
                                const next = { ...draftTypography, borderRadius: e.target.value };
                                setDraftTypography(next);
                                setDirty(true);
                                preview(undefined, next);
                            }}
                            placeholder="8px"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                        />
                    </label>
                </div>
            </section>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={saveCustom}
                    disabled={saving}
                    className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                >
                    {saving ? 'Applying…' : dirty ? 'Save & Apply Custom Theme' : 'Saved ✓'}
                </button>
                <button
                    onClick={resetToDefault}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-bold uppercase tracking-widest text-xs transition-all hover:border-slate-200 disabled:opacity-40"
                >
                    <RotateCcw className="w-4 h-4" /> Reset to Classic
                </button>
                {dirty && (
                    <button
                        onClick={() => {
                            const source = theme || DEFAULT_THEME;
                            setDraftColors({ ...source.colors });
                            setDraftTypography({ ...source.typography });
                            setActivePreset(source.preset || 'default');
                            setIsCustom(!!source.isCustom);
                            setDirty(false);
                            applyTheme(source);
                        }}
                        className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600"
                    >
                        Discard changes
                    </button>
                )}
            </div>
        </div>
    );
};

export default ThemeSettings;
