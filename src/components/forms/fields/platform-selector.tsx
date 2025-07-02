import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PlatformSelectorProps = {
	value: string;
	onValueChange: (value: 'facebook' | 'instagram') => void;
};

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
	value,
	onValueChange,
}) => {
	return (
		<div className="space-y-2">
			<Label htmlFor="socialtype">Social Platform</Label>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger id="socialtype">
					<SelectValue placeholder="Select platform" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="facebook">Facebook</SelectItem>
					<SelectItem value="instagram">Instagram</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
