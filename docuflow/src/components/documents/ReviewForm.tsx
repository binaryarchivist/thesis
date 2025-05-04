import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function ReviewForm({ document, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    status: document.status !== 'pending' ? document.status : '',
    review_notes: document.review_notes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status) {
      alert('Please select a decision (Approve or Reject)');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Review Document</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review the document and provide your decision below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base">Decision</Label>
            <p className="text-sm text-gray-500 mb-4">
              Choose whether to approve or reject this document
            </p>

            <RadioGroup
              value={formData.status}
              onValueChange={handleStatusChange}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <RadioGroupItem value="approved" id="approve" />
                <Label
                  htmlFor="approve"
                  className="flex items-center cursor-pointer font-normal"
                >
                  <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Approve</p>
                    <p className="text-sm text-gray-500">
                      Document will be sent to the assignee for signing
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <RadioGroupItem value="rejected" id="reject" />
                <Label
                  htmlFor="reject"
                  className="flex items-center cursor-pointer font-normal"
                >
                  <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center mr-3">
                    <XCircle className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-medium">Reject</p>
                    <p className="text-sm text-gray-500">
                      Document will be rejected and sent back
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review_notes">Review Notes</Label>
            <Textarea
              id="review_notes"
              name="review_notes"
              value={formData.review_notes}
              onChange={handleChange}
              placeholder="Add your comments or feedback about this document..."
              className="min-h-[150px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={
              formData.status === 'approved'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : formData.status === 'rejected'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }
            disabled={isSubmitting || !formData.status}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              `Submit Review`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
