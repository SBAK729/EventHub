"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
// import { useToast } from "@/components/ui/use-toast"

import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { eventFormSchema } from "@/lib/validator"
import type * as z from "zod"
import { eventDefaultValues } from "@/constants"
import { useState, useEffect } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { FileUploader } from "./FileUploader"
import MapComponent from "./MapComponent"

import "react-datepicker/dist/react-datepicker.css"
import { Checkbox } from "../ui/checkbox"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { getAllCategories } from "@/lib/actions/category.actions"
import type { IEvent } from "@/lib/database/models/event.model"
import { Calendar, MapPin, DollarSign, Upload, Link as LinkIcon, Globe } from "lucide-react"

type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEvent
  eventId?: string
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [locationType, setLocationType] = useState<"physical" | "online">("physical")
  const [categories, setCategories] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)
  
  const initialValues =
    event && type === "Update"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues
  const router = useRouter()

  const { startUpload } = useUploadThing("imageUploader")

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await getAllCategories()
        setCategories(categoriesList || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address })
    form.setValue('location', address)
  }

  const [successMessage, setSuccessMessage] = useState("")

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl

    if (files.length > 0) {
      const uploadedImages = await startUpload(files)

      if (!uploadedImages) {
        return
      }

      uploadedImageUrl = uploadedImages[0].url
    }

    const eventData = {
      ...values,
      imageUrl: uploadedImageUrl,
      location: locationType === "online" ? values.url || "" : values.location,
    }

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: eventData,
          userId,
          path: "/profile",
        })
if (newEvent) {
  form.reset()
  setSuccessMessage("✅ Event created successfully!")
  // optional: redirect after a short delay
  setTimeout(() => router.push("/profile"), 2000)
}

      } catch (error) {
        console.error('Create event failed:', error)
      }
    }

    if (type === "Update") {
      if (!eventId) {
        router.back()
        return
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { ...eventData, _id: eventId },
          path: `/events/${eventId}`,
        })

        if (updatedEvent) {
          form.reset()
          router.push(`/events/${updatedEvent._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
            <h1 className="text-3xl font-bold text-center">
              {type} Event
            </h1>
            <p className="text-center text-purple-100 mt-2">
              Create an amazing event for your community
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
              {/* Event Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
                </div>

                {/* Event Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Event Title *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter event title"
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your event..."
                          className="min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Category *</FormLabel>
                      <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                        <FormControl>
                          <SelectTrigger className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Event Image *</FormLabel>
                      <FormControl>
                        <FileUploader
                          onFieldChange={field.onChange}
                          imageUrl={field.value}
                          setFiles={setFiles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date & Time Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Date & Time</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Start Date & Time *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={field.value ? field.value.toISOString().slice(0, 16) : ""}
                            onChange={(e) => {
                              const date = new Date(e.target.value)
                              field.onChange(date)
                            }}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">End Date & Time *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={field.value ? field.value.toISOString().slice(0, 16) : ""}
                            onChange={(e) => {
                              const date = new Date(e.target.value)
                              field.onChange(date)
                            }}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Location</h2>
                </div>

                {/* Location Type */}
                <div className="space-y-3">
                  <FormLabel className="text-base font-medium">Event Type *</FormLabel>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setLocationType("physical")}
                      className={`flex-1 p-4 rounded-lg border-2 text-sm font-medium transition-colors ${
                        locationType === "physical"
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>Physical Venue</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationType("online")}
                      className={`flex-1 p-4 rounded-lg border-2 text-sm font-medium transition-colors ${
                        locationType === "online"
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Globe className="w-5 h-5" />
                        <span>Online Event</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Physical Location */}
                {locationType === "physical" && (
                  <div className="space-y-4">
                    <FormLabel className="text-base font-medium">Select Location *</FormLabel>
                    <MapComponent
                      onLocationSelect={handleLocationSelect}
                      initialLocation={selectedLocation || undefined}
                    />
                  </div>
                )}

                {/* Online Event Link */}
                {locationType === "online" && (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Event Link *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <LinkIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <Input
                              {...field}
                              placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                              className="pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Pricing Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Pricing</h2>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-medium">
                            This is a free event
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!form.watch("isFree") && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Price *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <DollarSign className="w-5 h-5 text-gray-400" />
                              </div>
                              <Input
                                {...field}
                                type="number"
                                placeholder="0.00"
                                className="pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div>

              {successMessage && (
              <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center">
                 {successMessage}
                   </div>
                 )}

                 </div>


              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Event...
                    </div>
                  ) : (
                    `${type} Event`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default EventForm
