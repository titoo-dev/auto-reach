import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MessageTemplateFieldProps = {
	value: string;
	onChange: (value: string) => void;
};

export const MessageTemplateField: React.FC<MessageTemplateFieldProps> = ({
	value,
	onChange,
}) => {
	return (
		<div className="space-y-2">
			<Label htmlFor="message">Message Template</Label>
			<Textarea
				id="message"
				className="min-h-[100px]"
				placeholder="Hi {{firstName}}, I hope you're doing well..."
				value={value}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
					onChange(e.target.value)
				}
				required
			/>
			<p className="text-xs text-muted-foreground">
				Use variables like <code>{`{{firstName}}`}</code>,{' '}
				<code>{`{{lastName}}`}</code>, <code>{`{{company}}`}</code> for
				personalization
			</p>
		</div>
	);
};
