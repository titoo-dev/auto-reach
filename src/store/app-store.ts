import type { SendObject, SocialPlatform } from '@/lib/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store state interface
interface AppStoreState {
    // Form state
    formData: SendObject;
    urlError: string;
    isPending: boolean;
    
    // Form actions
    updateFormField: (field: keyof SendObject, value: string) => void;
    setPlatform: (platform: SocialPlatform) => void;
    setUrlError: (error: string) => void;
    setPending: (pending: boolean) => void;
    validateUrl: (platform: SocialPlatform, url: string) => string;
    resetForm: () => void;
    
    // Computed properties
    isFormValid: () => boolean;
}

// Initial form state
const initialFormData: SendObject = {
    socialtype: 'facebook',
    userUrl: '',
    message: '',
};

// URL validation patterns
const URL_PATTERNS = {
    facebook: [
        /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/,
        /^https?:\/\/(www\.)?fb\.com\/[a-zA-Z0-9._-]+\/?$/,
        /^https?:\/\/(m\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/
    ],
    instagram: [
        /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/,
        /^https?:\/\/(www\.)?instagr\.am\/[a-zA-Z0-9._-]+\/?$/
    ]
} as const;

export const useAppStore = create<AppStoreState>()(
    devtools(
        (set, get) => ({
            // Initial state
            formData: initialFormData,
            urlError: '',
            isPending: false,

            // Actions
            updateFormField: (field: keyof SendObject, value: string): void => {
                set((state) => ({
                    formData: {
                        ...state.formData,
                        [field]: value,
                    },
                }), false, 'updateFormField');
                
                // Clear URL error when user starts typing
                if (field === 'userUrl') {
                    set({ urlError: '' }, false, 'clearUrlError');
                }
            },

            setPlatform: (platform: SocialPlatform): void => {
                set((state) => ({
                    formData: {
                        ...state.formData,
                        socialtype: platform,
                    },
                }), false, 'setPlatform');
                
                // Re-validate URL if it exists
                const { formData } = get();
                if (formData.userUrl.trim()) {
                    const error: string = get().validateUrl(platform, formData.userUrl);
                    set({ urlError: error }, false, 'revalidateUrl');
                }
            },

            setUrlError: (error: string): void => {
                set({ urlError: error }, false, 'setUrlError');
            },

            setPending: (pending: boolean): void => {
                set({ isPending: pending }, false, 'setPending');
            },

            validateUrl: (platform: SocialPlatform, url: string): string => {
                if (!url.trim()) {
                    return 'URL is required';
                }

                const trimmedUrl: string = url.trim();
                const patterns = URL_PATTERNS[platform];
                
                const isValidUrl: boolean = patterns.some((pattern) => pattern.test(trimmedUrl));
                
                if (!isValidUrl) {
                    const platformName: string = platform.charAt(0).toUpperCase() + platform.slice(1);
                    const exampleUrl: string = platform === 'facebook' 
                        ? 'https://facebook.com/username' 
                        : 'https://instagram.com/username';
                    return `Please enter a valid ${platformName} URL (e.g., ${exampleUrl})`;
                }

                return '';
            },

            resetForm: (): void => {
                set({
                    formData: initialFormData,
                    urlError: '',
                    isPending: false,
                }, false, 'resetForm');
            },

            isFormValid: (): boolean => {
                const { formData, urlError } = get();
                return !urlError && 
                             formData.userUrl.trim() !== '' && 
                             formData.message.trim() !== '';
            },
        }),
        {
            name: 'app-store',
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);

// Selectors for optimized re-renders
export const useFormData = (): SendObject => useAppStore((state) => state.formData);
export const useUrlError = (): string => useAppStore((state) => state.urlError);
export const useIsPending = (): boolean => useAppStore((state) => state.isPending);
export const useIsFormValid = (): boolean => useAppStore((state) => state.isFormValid());

// Action selectors
export const useFormActions = () => useAppStore((state) => ({
    updateFormField: state.updateFormField,
    setPlatform: state.setPlatform,
    setUrlError: state.setUrlError,
    setPending: state.setPending,
    validateUrl: state.validateUrl,
    resetForm: state.resetForm,
}));