'use client'

import * as z from 'zod'
import { useState } from 'react'
import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Store, BillBoard } from '@prisma/client'
import { Trash } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'
import ImageUpload from '@/components/ui/image-upload'

interface BillboardFormProps {
  initialData: BillBoard | null
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const origin = useOrigin()

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit billboard' : 'Add a new billboard'
  const toastMessage = initialData
    ? 'Billboard updated.'
    : ' Billboard created.'
  const action = initialData ? 'Save changes.' : 'Create'

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  })

  async function onSubmit(values: BillboardFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        )
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values)
      }

      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(
        `/api/stores/${params.storeId}/billboards/${params.billboardId}`
      )
      router.refresh()
      router.push('/')
      toast.success('Billboard deleted.')
    } catch (error) {
      toast.error(
        'Make sure you removed all categories using this billboard first.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
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
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
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
          ></FormField>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="label"
              control={form.control}
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
            ></FormField>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}
export default BillboardForm
