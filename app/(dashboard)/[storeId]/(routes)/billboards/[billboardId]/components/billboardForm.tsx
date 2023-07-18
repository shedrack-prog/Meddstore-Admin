'use client';

import * as z from 'zod';
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alertModal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ImageUpload from '@/components/ui/image-upload';

interface billboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  imgUrl: z.string().min(1),
  label: z.string().min(1),
});

type billboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<billboardFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const origin = useOrigin();

  const params = useParams();
  const router = useRouter();

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';
  const description = initialData ? 'Edit a Billboard' : 'Add a new Billboard';
  const toastMessage = initialData
    ? 'Billboard updated.'
    : 'Billboard created.';
  const action = initialData ? 'Save changes' : 'Create ';

  const form = useForm<billboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      imgUrl: '',
      label: '',
    },
  });

  const onSubmit = async (data: billboardFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/billboards`,
          data
        );
        console.log(response);
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      toast.success('Billboard deleted!');
      router.push('/');
    } catch (error) {
      toast.error('Make sure you delete all categories using this billboard');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size={'icon'}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4 " />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-6 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default BillboardForm;
