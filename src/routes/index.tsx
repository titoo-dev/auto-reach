import { createFileRoute } from '@tanstack/react-router';
import { type JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Instagram } from 'lucide-react';
import { ControlButtons } from '@/components/dashboard/control-buttons';
import { SendObjectsTable } from '@/components/dashboard/send-objects-table';
import { useAppStore, useSelectedCount, useSelectedItems, useSendObjects } from '@/store/app-store';

export const Route = createFileRoute('/')({
	component: App,
});


function App(): JSX.Element {
  const sendObjects = useSendObjects();
  const selectedItems = useSelectedItems();
  const selectedCount = useSelectedCount();
  
  const {
    selectAll,
    selectItem,
    deleteSelectedSendObjects,
    deleteSendObject,
  } = useAppStore.getState();

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
    selectAll(checked);
  };

  const handleSelectItem = (index: number, checked: boolean): void => {
    selectItem(index, checked);
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
    deleteSendObject(index);
  };

  const handleDeleteSelected = (): void => {
    deleteSelectedSendObjects();
  };

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




