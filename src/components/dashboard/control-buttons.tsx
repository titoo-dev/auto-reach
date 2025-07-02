import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

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

const AddSendObjectDialog: React.FC<AddSendObjectDialogProps> = ({
    isOpen,
    onOpenChange,
    onAdd,
}) => {
    const handleAddClick = (): void => {
        onAdd();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={handleAddClick}>
                    Add Send Object
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Object Form</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Welcome to send object form
                </p>
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
