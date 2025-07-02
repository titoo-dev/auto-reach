import type { SendObject, SocialPlatform } from '@/lib/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store state interface
interface AppStoreState {
    // Form state
    formData: SendObject;
    urlError: string;
    isPending: boolean;
    
    // Send objects state
    sendObjects: SendObject[];
    selectedItems: Set<number>;
    
    // Form actions
    updateFormField: (field: keyof SendObject, value: string) => void;
    setPlatform: (platform: SocialPlatform) => void;
    setUrlError: (error: string) => void;
    setPending: (pending: boolean) => void;
    validateUrl: (platform: SocialPlatform, url: string) => string;
    resetForm: () => void;
    
    // Send objects actions
    setSendObjects: (sendObjects: SendObject[]) => void;
    addSendObject: (sendObject: SendObject) => void;
    updateSendObject: (index: number, sendObject: SendObject) => void;
    deleteSendObject: (index: number) => void;
    deleteSelectedSendObjects: () => void;
    
    // Selection actions
    setSelectedItems: (selectedItems: Set<number>) => void;
    selectAll: (checked: boolean) => void;
    selectItem: (index: number, checked: boolean) => void;
    clearSelection: () => void;
    
    // Computed properties
    isFormValid: () => boolean;
    selectedCount: () => number;
}

// Initial form state
const initialFormData: SendObject = {
    socialtype: 'facebook',
    userUrl: '',
    message: '',
};

// Initial send objects data
const initialSendObjects: SendObject[] = [
    {
        socialtype: 'facebook',
        userUrl: 'https://facebook.com/john.doe',
        message: 'Hey {{firstName}}, I saw your post about {{company}} and would love to connect!',
    },
    {
        socialtype: 'instagram',
        userUrl: 'https://instagram.com/jane_smith',
        message: "Hi {{firstName}}, your content on {{company}} is amazing. Let's collaborate!",
    },
    {
        socialtype: 'facebook',
        userUrl: 'https://facebook.com/mike.johnson',
        message: 'Hello {{firstName}}, interested in discussing opportunities at {{company}}.',
    },
    {
        socialtype: 'instagram',
        userUrl: 'https://instagram.com/sarah_wilson',
        message: 'Hi there! Love your work at {{company}}. Would you be open to a quick chat?',
    },
    {
        socialtype: 'facebook',
        userUrl: 'https://facebook.com/alex.brown',
        message: 'Hey {{firstName}}, your expertise in {{company}} caught my attention!',
    },
];

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
            sendObjects: initialSendObjects,
            selectedItems: new Set<number>(),

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

            setSendObjects: (sendObjects: SendObject[]): void => {
                set({ sendObjects }, false, 'setSendObjects');
            },

            addSendObject: (sendObject: SendObject): void => {
                set((state) => ({
                    sendObjects: [...state.sendObjects, sendObject],
                }), false, 'addSendObject');
            },

            updateSendObject: (index: number, sendObject: SendObject): void => {
                set((state) => ({
                    sendObjects: state.sendObjects.map((obj, i) => 
                        i === index ? sendObject : obj
                    ),
                }), false, 'updateSendObject');
            },

            deleteSendObject: (index: number): void => {
                set((state) => {
                    const newSendObjects = state.sendObjects.filter((_, i) => i !== index);
                    
                    // Update selected items to maintain correct indices
                    const newSelected = new Set<number>();
                    state.selectedItems.forEach((selectedIndex) => {
                        if (selectedIndex < index) {
                            newSelected.add(selectedIndex);
                        } else if (selectedIndex > index) {
                            newSelected.add(selectedIndex - 1);
                        }
                    });
                    
                    return {
                        sendObjects: newSendObjects,
                        selectedItems: newSelected,
                    };
                }, false, 'deleteSendObject');
            },

            deleteSelectedSendObjects: (): void => {
                set((state) => ({
                    sendObjects: state.sendObjects.filter(
                        (_, index) => !state.selectedItems.has(index)
                    ),
                    selectedItems: new Set<number>(),
                }), false, 'deleteSelectedSendObjects');
            },

            setSelectedItems: (selectedItems: Set<number>): void => {
                set({ selectedItems }, false, 'setSelectedItems');
            },

            selectAll: (checked: boolean): void => {
                const { sendObjects } = get();
                if (checked) {
                    set({ 
                        selectedItems: new Set(sendObjects.map((_, index) => index)) 
                    }, false, 'selectAll');
                } else {
                    set({ selectedItems: new Set() }, false, 'deselectAll');
                }
            },

            selectItem: (index: number, checked: boolean): void => {
                set((state) => {
                    const newSelected = new Set(state.selectedItems);
                    if (checked) {
                        newSelected.add(index);
                    } else {
                        newSelected.delete(index);
                    }
                    return { selectedItems: newSelected };
                }, false, 'selectItem');
            },

            clearSelection: (): void => {
                set({ selectedItems: new Set() }, false, 'clearSelection');
            },

            isFormValid: (): boolean => {
                const { formData, urlError } = get();
                return !urlError && 
                             formData.userUrl.trim() !== '' && 
                             formData.message.trim() !== '';
            },

            selectedCount: (): number => {
                return get().selectedItems.size;
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

// Additional selectors for send objects
export const useSendObjects = (): SendObject[] => useAppStore((state) => state.sendObjects);
export const useSelectedItems = (): Set<number> => useAppStore((state) => state.selectedItems);
export const useSelectedCount = (): number => useAppStore((state) => state.selectedCount());

// Send objects action selectors
export const useSendObjectActions = () => useAppStore((state) => ({
    setSendObjects: state.setSendObjects,
    addSendObject: state.addSendObject,
    updateSendObject: state.updateSendObject,
    deleteSendObject: state.deleteSendObject,
    deleteSelectedSendObjects: state.deleteSelectedSendObjects,
}));
