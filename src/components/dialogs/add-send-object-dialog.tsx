import { useTransition } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { SendObject } from '@/lib/types';
import {
	useAppStore,
	useFormData,
	useIsFormValid,
	useUrlError,
} from '@/store/app-store';

type AddSendObjectDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: () => void;
};

export const AddSendObjectDialog: React.FC<AddSendObjectDialogProps> = ({
    isOpen,
    onOpenChange,
    onAdd,
}) => {
    const [isPending, startTransition] = useTransition();

    // Use Zustand store instead of local state
    const formData = useFormData();
    const urlError = useUrlError();
    const isFormValid = useIsFormValid();
    const { updateFormField, setPlatform, validateUrl, setUrlError, resetForm } =
        useAppStore.getState();

    const handleInputChange = (
        field: keyof SendObject,
        value: string
    ): void => {
        updateFormField(field, value);
    };

    const handlePlatformChange = (platform: 'facebook' | 'instagram'): void => {
        setPlatform(platform);
    };

    const handleUrlBlur = (): void => {
        const error: string = validateUrl(
            formData.socialtype,
            formData.userUrl
        );
        setUrlError(error);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // Validate form using store validation
        const urlValidationError: string = validateUrl(
            formData.socialtype,
            formData.userUrl
        );
        setUrlError(urlValidationError);

        if (urlValidationError || !formData.message.trim()) {
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

            // Reset form using store action
            resetForm();

            // Close dialog
            onOpenChange(false);
        });
    };

    const handleCancel = (): void => {
        resetForm();
        onOpenChange(false);
    };

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
                                    ? 'https://facebook.com/username'
                                    : 'https://instagram.com/username'
                            }
                            value={formData.userUrl}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleInputChange('userUrl', e.target.value)}
                            onBlur={handleUrlBlur}
                            className={
                                urlError
                                    ? 'border-red-500 focus:border-red-500'
                                    : ''
                            }
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
                                ? 'Supports facebook.com and fb.com URLs'
                                : 'Supports instagram.com and instagr.am URLs'}
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
