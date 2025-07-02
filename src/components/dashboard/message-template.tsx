import { Badge } from "../ui/badge";

type MessageTemplateProps = {
	message: string;
};

export const MessageTemplate: React.FC<MessageTemplateProps> = ({ message }) => {
	const variables: RegExpMatchArray | null =
		message.match(/\{\{[\w\s]+\}\}/g);

	return (
		<div className="max-w-md">
			<p className="text-sm leading-relaxed text-foreground/90 line-clamp-2">
				{message}
			</p>
			{variables && (
				<div className="flex flex-wrap gap-1 mt-2">
					{variables.map((variable, idx) => (
						<Badge key={idx} variant="outline" className="text-xs">
							{variable}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};
