'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { useStoreModal } from '@/hooks/use-state-modal';
import { Modal } from '../ui/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import axios from 'axios';

const formSchema = z.object({
  name: z.string().min(1),
});
export const StoreModal = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  const store = useStoreModal();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/stores', values);

      toast.success('Store created successfully');

      setTimeout(() => {
        window.location.assign(`/${response.data.id}`);
      }, 500);
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      isOpen={store.isOpen}
      onClose={store.onClose}
      description="Add a new store to manage store and category"
      title="Create Store"
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Store name... example: 'Shoe store'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 space-x-6 flex items-center justify-end w-full">
                <Button
                  variant={'outline'}
                  disabled={loading}
                  onClick={store.onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
