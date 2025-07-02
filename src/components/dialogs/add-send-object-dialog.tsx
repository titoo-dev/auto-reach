import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type AddSendObjectDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: () => void;
};

type AddSendObjectFormData = {
	socialtype: 'facebook' | 'instagram';
	userUrl: string;
	message: string;
};

export const AddSendObjectDialog: React.FC<AddSendObjectDialogProps> = ({
    isOpen,
    onOpenChange,
    onAdd,
}) => {
    const [formData, setFormData] = useState<AddSendObjectFormData>({
        socialtype: 'facebook',
        userUrl: '',
        message: '',
    });
    const [isPending, startTransition] = useTransition();
    const [urlError, setUrlError] = useState<string>('');

    const validateUrl = (platform: 'facebook' | 'instagram', url: string): string => {
        if (!url.trim()) {
            return 'URL is required';
        }

        const trimmedUrl: string = url.trim();
        
        // Define validation patterns for each platform
        const patterns = {
            facebook: [
                /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/,
                /^https?:\/\/(www\.)?fb\.com\/[a-zA-Z0-9._-]+\/?$/,
                /^https?:\/\/(m\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/
            ],
            instagram: [
                /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/,
                /^https?:\/\/(www\.)?instagr\.am\/[a-zA-Z0-9._-]+\/?$/
            ]
        };

        const isValidUrl: boolean = patterns[platform].some((pattern) => pattern.test(trimmedUrl));
        
        if (!isValidUrl) {
            const platformName: string = platform.charAt(0).toUpperCase() + platform.slice(1);
            const exampleUrl: string = platform === 'facebook' 
                ? 'https://facebook.com/username' 
                : 'https://instagram.com/username';
            return `Please enter a valid ${platformName} URL (e.g., ${exampleUrl})`;
        }

        return '';
    };

    const handleInputChange = (
        field: keyof AddSendObjectFormData,
        value: string
    ): void => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear URL error when user starts typing
        if (field === 'userUrl') {
            setUrlError('');
        }
    };

    const handlePlatformChange = (platform: 'facebook' | 'instagram'): void => {
        setFormData((prev) => ({
            ...prev,
            socialtype: platform,
        }));
        
        // Re-validate URL if it exists
        if (formData.userUrl.trim()) {
            const error: string = validateUrl(platform, formData.userUrl);
            setUrlError(error);
        }
    };

    const handleUrlBlur = (): void => {
        const error: string = validateUrl(formData.socialtype, formData.userUrl);
        setUrlError(error);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // Validate form
        const urlValidationError: string = validateUrl(formData.socialtype, formData.userUrl);
        
        if (urlValidationError || !formData.message.trim()) {
            setUrlError(urlValidationError);
            return;
        }

        startTransition(() => {
            // Console log submitted information
            console.log('Submitted Send Object:', {
                socialtype: formData.socialtype,
                userUrl: formData.userUrl.trim(),
                message: formData.message.trim(),
            });

            // Call parent add function
            onAdd();

            // Reset form
            setFormData({
                socialtype: 'facebook',
                userUrl: '',
                message: '',
            });
            setUrlError('');

            // Close dialog
            onOpenChange(false);
        });
    };

    const handleCancel = (): void => {
        setFormData({
            socialtype: 'facebook',
            userUrl: '',
            message: '',
        });
        setUrlError('');
        onOpenChange(false);
    };

    const isFormValid: boolean = !urlError && formData.userUrl.trim() !== '' && formData.message.trim() !== '';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Send Object</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Send Object</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="socialtype">Social Platform</Label>
                        <Select
                            value={formData.socialtype}
                            onValueChange={handlePlatformChange}
                        >
                            <SelectTrigger id="socialtype">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="facebook">
                                    Facebook
                                </SelectItem>
                                <SelectItem value="instagram">
                                    Instagram
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="userUrl">Profile URL</Label>
                        <Input
                            id="userUrl"
                            type="url"
                            placeholder={
                                formData.socialtype === 'facebook'
                                    ? "https://facebook.com/username"
                                    : "https://instagram.com/username"
                            }
                            value={formData.userUrl}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleInputChange('userUrl', e.target.value)}
                            onBlur={handleUrlBlur}
                            className={urlError ? "border-red-500 focus:border-red-500" : ""}
                            required
                        />
                        {urlError && (
                            <p className="text-sm text-red-500 flex items-start gap-1">
                                <span className="text-red-500 mt-0.5">⚠</span>
                                {urlError}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {formData.socialtype === 'facebook' 
                                ? "Supports facebook.com and fb.com URLs"
                                : "Supports instagram.com and instagr.am URLs"
                            }
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message Template</Label>
                        <Textarea
                            id="message"
                            className="min-h-[100px]"
                            placeholder="Hi {{firstName}}, I hope you're doing well..."
                            value={formData.message}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => handleInputChange('message', e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Use variables like <code>{`{{firstName}}`}</code>,{' '}
                            <code>{`{{lastName}}`}</code>,{' '}
                            <code>{`{{company}}`}</code> for personalization
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !isFormValid}
                            className="min-w-[80px]"
                        >
                            {isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
