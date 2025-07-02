import { Button } from "../ui/button";

type ControlButtonsProps = {
	selectedCount: number;
	onAdd: () => void;
	onSend: () => void;
	onDeleteSelected: () => void;
};

export const ControlButtons: React.FC<ControlButtonsProps> = ({
	selectedCount,
	onAdd,
	onSend,
	onDeleteSelected,
}) => {
	return (
		<div className="flex items-center gap-2">
			<Button variant="outline" onClick={onAdd}>
				Add Send Object
			</Button>
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
