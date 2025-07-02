import { Edit, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import type { JSX } from "react";
import { MessageTemplate } from "./message-template";
import type { SendObject } from "@/lib/types";

type SendObjectRowProps = {
	sendObj: SendObject;
	index: number;
	isSelected: boolean;
	onSelect: (index: number, checked: boolean) => void;
	onEdit: (index: number) => void;
	onDelete: (index: number) => void;
	getSocialIcon: (socialtype: 'facebook' | 'instagram') => JSX.Element;
	getSocialColor: (socialtype: 'facebook' | 'instagram') => string;
};

export const SendObjectRow: React.FC<SendObjectRowProps> = ({
	sendObj,
	index,
	isSelected,
	onSelect,
	onEdit,
	onDelete,
	getSocialIcon,
	getSocialColor,
}) => {
	return (
		<TableRow
			className={`group hover:bg-muted/30 ${
				isSelected ? 'bg-muted/50' : ''
			}`}
		>
			<TableCell>
				<input
					type="checkbox"
					checked={isSelected}
					onChange={(e) => onSelect(index, e.target.checked)}
					className="w-4 h-4 rounded border-input accent-primary"
				/>
			</TableCell>
			<TableCell>
				<Badge
					variant="secondary"
					className={`${getSocialColor(
						sendObj.socialtype
					)} font-medium`}
				>
					<span className="mr-1">
						{getSocialIcon(sendObj.socialtype)}
					</span>
					{sendObj.socialtype.charAt(0).toUpperCase() +
						sendObj.socialtype.slice(1)}
				</Badge>
			</TableCell>
			<TableCell>
				<div className="flex flex-col">
					<a
						href={sendObj.userUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline font-medium truncate max-w-[250px]"
					>
						{sendObj.userUrl}
					</a>
					<span className="text-xs text-muted-foreground">
						Profile URL
					</span>
				</div>
			</TableCell>
			<TableCell>
				<MessageTemplate message={sendObj.message} />
			</TableCell>
			<TableCell>
				<Badge
					variant="default"
					className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
				>
					Ready
				</Badge>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onEdit(index)}
						className="h-8 px-2 hover:bg-muted"
					>
						<Edit className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onDelete(index)}
						className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
};
