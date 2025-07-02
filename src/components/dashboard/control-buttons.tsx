import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import React, { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

type ControlButtonsProps = {
	selectedCount: number;
	onAdd: () => void;
	onSend: () => void;
	onDeleteSelected: () => void;
};

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

const AddSendObjectDialog: React.FC<AddSendObjectDialogProps> = ({
    isOpen,
    onOpenChange,
    onAdd,
}) => {
    const [formData, setFormData] = useState<AddSendObjectFormData>({
        socialtype: 'facebook',
        userUrl: '',
        message: ''
    });
    const [isPending, startTransition] = useTransition();

    const handleInputChange = (field: keyof AddSendObjectFormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        
        // Validate form
        if (!formData.userUrl.trim() || !formData.message.trim()) {
            return;
        }

        startTransition(() => {
            // Console log submitted information
            console.log('Submitted Send Object:', {
                socialtype: formData.socialtype,
                userUrl: formData.userUrl.trim(),
                message: formData.message.trim()
            });

            // Call parent add function
            onAdd();
            
            // Reset form
            setFormData({
                socialtype: 'facebook',
                userUrl: '',
                message: ''
            });
            
            // Close dialog
            onOpenChange(false);
        });
    };

    const handleCancel = (): void => {
        setFormData({
            socialtype: 'facebook',
            userUrl: '',
            message: ''
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Add Send Object
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Send Object</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="socialtype">Social Platform</Label>
                        <Select 
                            value={formData.socialtype} 
                            onValueChange={(value: 'facebook' | 'instagram') => 
                                handleInputChange('socialtype', value)
                            }
                        >
                            <SelectTrigger id="socialtype">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="userUrl">Profile URL</Label>
                        <Input
                            id="userUrl"
                            type="url"
                            placeholder="https://facebook.com/username or https://instagram.com/username"
                            value={formData.userUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                handleInputChange('userUrl', e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message Template</Label>
                        <Textarea
                            id="message"
                            className="min-h-[100px]"
                            placeholder="Hi {{firstName}}, I hope you're doing well..."
                            value={formData.message}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                                handleInputChange('message', e.target.value)
                            }
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Use variables like <code>{`{{firstName}}`}</code>, <code>{`{{lastName}}`}</code>, <code>{`{{company}}`}</code> for personalization
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
                            disabled={isPending || !formData.userUrl.trim() || !formData.message.trim()}
                            className="min-w-[80px]"
                        >
                            {isPending ? "Adding..." : "Add"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export const ControlButtons: React.FC<ControlButtonsProps> = ({
    selectedCount,
    onAdd,
    onSend,
    onDeleteSelected,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <div className="flex items-center gap-2">
            <AddSendObjectDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onAdd={onAdd}
            />
            {selectedCount > 0 && (
                <>
                    <Button
                        onClick={onSend}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Send ({selectedCount})
                    </Button>
                    <Button variant="destructive" onClick={onDeleteSelected}>
                        Delete ({selectedCount})
                    </Button>
                </>
            )}
        </div>
    );
};
