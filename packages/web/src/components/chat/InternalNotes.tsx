import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/atomic-design/atoms/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atomic-design/molecules/Card';
import { Save, Eye } from 'lucide-react';

interface InternalNotesProps {
  conversationId: string;
  initialNotes?: string;
}

export function InternalNotes({
  conversationId,
  initialNotes = '',
}: InternalNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, you would save to the backend
      // await trpc.chat.updateInternalNotes.mutate({ conversationId, notes });
      console.log('Saving notes for conversation:', conversationId, notes);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    setIsEditing(false);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Internal Notes
        </CardTitle>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">
                Notes (Private - not visible to customer)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this conversation..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {notes ? (
              <p className="whitespace-pre-wrap">{notes}</p>
            ) : (
              <p className="italic">No internal notes added yet.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
