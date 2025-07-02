import { AddSendObjectDialog, createStandardAddDialog } from '../dialogs/add-send-object-dialog';
import { Button } from '../ui/button';
import React, { useState } from 'react';

type ControlButtonsProps = {
	selectedCount: number;
	onSend: () => void;
	onDeleteSelected: () => void;
};

export const ControlButtons: React.FC<ControlButtonsProps> = ({
	selectedCount,
	onSend,
	onDeleteSelected,
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	return (
		<div className="flex items-center gap-2">
			<AddSendObjectDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				config={createStandardAddDialog()}
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
