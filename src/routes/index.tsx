import { createFileRoute } from '@tanstack/react-router';
import { useState, type JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Facebook, Instagram, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/')({
	component: App,
});

type SendObject = {
	socialtype: 'facebook' | 'instagram';
	userUrl: string;
	message: string;
};

function App() {
  const [sendObjects, setSendObjects] = useState<SendObject[]>([
    {
      socialtype: 'facebook',
      userUrl: 'https://facebook.com/john.doe',
      message:
        'Hey {{firstName}}, I saw your post about {{company}} and would love to connect!',
    },
    {
      socialtype: 'instagram',
      userUrl: 'https://instagram.com/jane_smith',
      message:
        "Hi {{firstName}}, your content on {{company}} is amazing. Let's collaborate!",
    },
    {
      socialtype: 'facebook',
      userUrl: 'https://facebook.com/mike.johnson',
      message:
        'Hello {{firstName}}, interested in discussing opportunities at {{company}}.',
    },
    {
      socialtype: 'instagram',
      userUrl: 'https://instagram.com/sarah_wilson',
      message:
        'Hi there! Love your work at {{company}}. Would you be open to a quick chat?',
    },
    {
      socialtype: 'facebook',
      userUrl: 'https://facebook.com/alex.brown',
      message:
        'Hey {{firstName}}, your expertise in {{company}} caught my attention!',
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const getSocialIcon = (socialtype: 'facebook' | 'instagram'): JSX.Element => {
    return socialtype === 'facebook' ? (
      <Facebook className="w-3 h-3" />
    ) : (
      <Instagram className="w-3 h-3" />
    );
  };

  const getSocialColor = (socialtype: 'facebook' | 'instagram'): string => {
    return socialtype === 'facebook'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
  };

  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      setSelectedItems(new Set(sendObjects.map((_, index) => index)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (index: number, checked: boolean): void => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedItems(newSelected);
  };

  const handleSendSelected = (): void => {
    const selectedMessages = Array.from(selectedItems).map(
      (index) => sendObjects[index]
    );
    console.log('Sending messages:', selectedMessages);
    // Add your send logic here
  };

  const handleEdit = (index: number): void => {
    console.log('Editing message at index:', index);
    // Add your edit logic here
  };

  const handleDelete = (index: number): void => {
    const newSendObjects = sendObjects.filter((_, i) => i !== index);
    setSendObjects(newSendObjects);

    // Update selected items to maintain correct indices
    const newSelected = new Set<number>();
    selectedItems.forEach((selectedIndex) => {
      if (selectedIndex < index) {
        newSelected.add(selectedIndex);
      } else if (selectedIndex > index) {
        newSelected.add(selectedIndex - 1);
      }
    });
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = (): void => {
    const newSendObjects = sendObjects.filter(
      (_, index) => !selectedItems.has(index)
    );
    setSendObjects(newSendObjects);
    setSelectedItems(new Set());
  };

  const selectedCount: number = selectedItems.size;
  const allSelected: boolean = selectedCount === sendObjects.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Outreach Messages</CardTitle>
              <p className="text-muted-foreground">
                Manage your multichannel prospecting automation messages
              </p>
            </div>
            <ControlButtons
              selectedCount={selectedCount}
              allSelected={allSelected}
              onSelectAll={handleSelectAll}
              onAdd={() => console.log('Creating new send object')}
              onSend={handleSendSelected}
              onDeleteSelected={handleDeleteSelected}
            />
          </CardHeader>
          <CardContent>
            {sendObjects.length > 0 ? (
              <SendObjectsTable
                sendObjects={sendObjects}
                selectedItems={selectedItems}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getSocialIcon={getSocialIcon}
                getSocialColor={getSocialColor}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                  <p className="text-sm">
                    Start by creating your first outreach message template.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type ControlButtonsProps = {
  selectedCount: number;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onAdd: () => void;
  onSend: () => void;
  onDeleteSelected: () => void;
};

const ControlButtons: React.FC<ControlButtonsProps> = ({
  selectedCount,
  allSelected,
  onSelectAll,
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

const SendObjectsTable: React.FC<SendObjectsTableProps> = ({
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

const SendObjectRow: React.FC<SendObjectRowProps> = ({
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
          className={`${getSocialColor(sendObj.socialtype)} font-medium`}
        >
          <span className="mr-1">{getSocialIcon(sendObj.socialtype)}</span>
          {sendObj.socialtype.charAt(0).toUpperCase() + sendObj.socialtype.slice(1)}
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
          <span className="text-xs text-muted-foreground">Profile URL</span>
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

type MessageTemplateProps = {
  message: string;
};

const MessageTemplate: React.FC<MessageTemplateProps> = ({ message }) => {
  const variables: RegExpMatchArray | null = message.match(/\{\{[\w\s]+\}\}/g);

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
