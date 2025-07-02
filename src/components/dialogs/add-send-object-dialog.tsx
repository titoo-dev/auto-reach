import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AddSendObjectForm } from '../forms/add-send-object-form';

type DialogConfig = {
	title: string;
	triggerText: string;
	triggerVariant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	maxWidth: string;
	showTrigger: boolean;
};

type AddSendObjectDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: () => void;
	config?: Partial<DialogConfig>;
};

// Factory function for creating dialog configurations
const createDialogConfig = (overrides: Partial<DialogConfig> = {}): DialogConfig => ({
	title: 'Add New Send Object',
	triggerText: 'Add Send Object',
	triggerVariant: 'outline',
	maxWidth: 'sm:max-w-[500px]',
	showTrigger: true,
	...overrides,
});

// Factory functions for specific use cases
export const createStandardAddDialog = (): Partial<DialogConfig> => 
	createDialogConfig();

export const createQuickAddDialog = (): Partial<DialogConfig> => 
	createDialogConfig({
		title: 'Quick Add',
		triggerText: 'Quick Add',
		triggerVariant: 'default',
		maxWidth: 'sm:max-w-[400px]',
	});

export const createBulkAddDialog = (): Partial<DialogConfig> => 
	createDialogConfig({
		title: 'Bulk Add Send Objects',
		triggerText: 'Bulk Add',
		triggerVariant: 'secondary',
		maxWidth: 'sm:max-w-[600px]',
	});

export const createModalOnlyDialog = (): Partial<DialogConfig> => 
	createDialogConfig({
		showTrigger: false,
	});

export const AddSendObjectDialog: React.FC<AddSendObjectDialogProps> = ({
    isOpen,
    onOpenChange,
    onAdd,
    config: configOverrides,
}) => {
    const config: DialogConfig = createDialogConfig(configOverrides);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {config.showTrigger && (
                <DialogTrigger asChild>
                    <Button variant={config.triggerVariant}>{config.triggerText}</Button>
                </DialogTrigger>
            )}
            <DialogContent className={config.maxWidth}>
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                </DialogHeader>
                <AddSendObjectForm onAdd={onAdd} onCancel={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
};
