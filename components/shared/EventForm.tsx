"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator"
import type * as z from "zod"
import { eventDefaultValues } from "@/constants"
import { useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"

import "react-datepicker/dist/react-datepicker.css"
import { Checkbox } from "../ui/checkbox"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import type { IEvent } from "@/lib/database/models/event.model"

type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEvent
  eventId?: string
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [locationType, setLocationType] = useState<"physical" | "online">("physical")
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

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl

    if (files.length > 0) {
      const uploadedImages = await startUpload(files)

      if (!uploadedImages) {
        return
      }

      uploadedImageUrl = uploadedImages[0].url
    }

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: "/profile",
        })

        if (newEvent) {
          form.reset()
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log(error)
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
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
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
    // <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <div className="w-full mx-auto">
        {/* <div className="bg-purple-600 text-white p-4 rounded-t-xl flex items-center justify-between"> */}
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center"> */}
              {/* <span className="text-purple-600 font-bold text-sm">C</span> */}
            {/* </div> */}
            {/* <span className="font-semibold">Event Hub</span> */}
          </div>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        {/* </div> */}

        <div className="bg-white rounded-b-xl shadow-lg bg-center">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">Create Event</h1>

            

            {/* Step indicator */}
            <div className="flex items-center justify-center mb-8">
              {["Details", "Date & Location", "Review"].map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 1
                        ? "bg-purple-600 text-white"
                        : index === 0
                          ? "bg-purple-600 text-white"
                          : "border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {index < 1 ? "✓" : index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`flex-1 h-0.5 mx-4 ${index === 0 ? "bg-purple-600" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>
          {/* </div> */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">When and where is it happening?</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Event Date</label>
                <FormField
                  control={form.control}
                  name="startDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ? field.value.toISOString().split("T")[0] : ""}
                          onChange={(e) => {
                            const date = new Date(e.target.value)
                            field.onChange(date)
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Time</label>
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value ? field.value.toTimeString().slice(0, 5) : ""}
                            onChange={(e) => {
                              const currentDate = field.value || new Date()
                              const [hours, minutes] = e.target.value.split(":")
                              const newDate = new Date(currentDate)
                              newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                              field.onChange(newDate)
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Time</label>
                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value ? field.value.toTimeString().slice(0, 5) : ""}
                            onChange={(e) => {
                              const currentDate = field.value || new Date()
                              const [hours, minutes] = e.target.value.split(":")
                              const newDate = new Date(currentDate)
                              newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                              field.onChange(newDate)
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="all-day" className="w-4 h-4" />
                <label htmlFor="all-day" className="text-sm text-gray-700">
                  All-day event
                </label>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Location Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLocationType("physical")}
                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                      locationType === "physical"
                        ? "bg-purple-100 border-purple-500 text-purple-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Venue (Physical Location)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationType("online")}
                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                      locationType === "online"
                        ? "bg-purple-100 border-purple-500 text-purple-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Online Event
                  </button>
                </div>
              </div>

              {locationType === "physical" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Venue Address</label>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <Input
                              {...field}
                              placeholder="Enter venue address"
                              className="pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

               <Button 
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white col-span-2"
        >
          {form.formState.isSubmitting ? (
            'Submitting...'
          ): `${type} Event `}</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default EventForm
