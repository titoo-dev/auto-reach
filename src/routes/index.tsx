import { createFileRoute } from '@tanstack/react-router';
import { useState, type JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Instagram } from 'lucide-react';
import { ControlButtons } from '@/components/dashboard/control-buttons';
import { SendObjectsTable } from '@/components/dashboard/send-objects-table';

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




