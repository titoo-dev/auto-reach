import type { JSX } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { SendObjectRow } from "./send-object-row";

type SendObjectsTableProps = {
	sendObjects: SendObject[];
	selectedItems: Set<number>;
	onSelectAll: (checked: boolean) => void;
	onSelectItem: (index: number, checked: boolean) => void;
	onEdit: (index: number) => void;
	onDelete: (index: number) => void;
	getSocialIcon: (socialtype: 'facebook' | 'instagram') => JSX.Element;
	getSocialColor: (socialtype: 'facebook' | 'instagram') => string;
};

export const SendObjectsTable: React.FC<SendObjectsTableProps> = ({
	sendObjects,
	selectedItems,
	onSelectAll,
	onSelectItem,
	onEdit,
	onDelete,
	getSocialIcon,
	getSocialColor,
}) => {
	const allSelected: boolean = selectedItems.size === sendObjects.length;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[50px]">
						<input
							type="checkbox"
							checked={allSelected}
							onChange={(e) => onSelectAll(e.target.checked)}
							className="w-4 h-4 rounded border-input accent-primary"
						/>
					</TableHead>
					<TableHead className="w-[120px]">Platform</TableHead>
					<TableHead className="w-[300px]">User Profile</TableHead>
					<TableHead>Message Template</TableHead>
					<TableHead className="w-[100px]">Status</TableHead>
					<TableHead className="w-[120px]">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{sendObjects.map((sendObj, index) => (
					<SendObjectRow
						key={index}
						index={index}
						sendObj={sendObj}
						isSelected={selectedItems.has(index)}
						onSelect={onSelectItem}
						onEdit={onEdit}
						onDelete={onDelete}
						getSocialIcon={getSocialIcon}
						getSocialColor={getSocialColor}
					/>
				))}
			</TableBody>
		</Table>
	);
};
