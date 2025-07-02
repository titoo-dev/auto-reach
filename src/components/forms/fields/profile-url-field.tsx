import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileUrlFieldProps = {
	socialType: string;
	value: string;
	error: string;
	onChange: (value: string) => void;
	onBlur: () => void;
};

export const ProfileUrlField: React.FC<ProfileUrlFieldProps> = ({
	socialType,
	value,
	error,
	onChange,
	onBlur,
}) => {
	return (
		<div className="space-y-2">
			<Label htmlFor="userUrl">Profile URL</Label>
			<Input
				id="userUrl"
				type="url"
				placeholder={
					socialType === 'facebook'
						? 'https://facebook.com/username'
						: 'https://instagram.com/username'
				}
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					onChange(e.target.value)
				}
				onBlur={onBlur}
				className={error ? 'border-red-500 focus:border-red-500' : ''}
				required
			/>
			{error && (
				<p className="text-sm text-red-500 flex items-start gap-1">
					<span className="text-red-500 mt-0.5">⚠</span>
					{error}
				</p>
			)}
			<p className="text-xs text-muted-foreground">
				{socialType === 'facebook'
					? 'Supports facebook.com and fb.com URLs'
					: 'Supports instagram.com and instagr.am URLs'}
			</p>
		</div>
	);
};
