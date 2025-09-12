"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { getAllCategories } from "@/lib/actions/category.actions"
import { useUploadThing } from "@/lib/uploadthing"
import { FileUploader } from "./FileUploader"
import MapComponent from "./MapComponent"

type IEventForm = {
  _id?: string
  title: string
  description: string
  categoryId: string
  imageUrl: string
  startDateTime: string   // string for input
  endDateTime: string
  location: string
  url?: string
  isFree: boolean
  price: string           // keep string in form
  tags?: string[]
}

type BackendEventPayload = {
  _id?: string
  title: string
  description: string
  categoryId: string
  imageUrl: string
  startDateTime: Date
  endDateTime: Date
  location: string
  url: string
  isFree: boolean
  price: string
  tags: string[]
}

type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEventForm
  eventId?: string
}

const eventDefaultValues: IEventForm = {
  title: "",
  description: "",
  categoryId: "",
  imageUrl: "",
  startDateTime: "",
  endDateTime: "",
  location: "",
  url: "",
  isFree: true,
  price: "",
  tags: [],
}

function convertFormToBackend(e: IEventForm): BackendEventPayload {
  return {
    _id: e._id,
    title: e.title,
    description: e.description,
    categoryId: e.categoryId,
    imageUrl: e.imageUrl,
    startDateTime: e.startDateTime ? new Date(e.startDateTime) : new Date(),
    endDateTime: e.endDateTime ? new Date(e.endDateTime) : new Date(),
    location: e.location ?? "",
    url: e.url ?? "",
    isFree: e.isFree,
    price: e.price || "0",
    tags: e.tags ?? [],
  }
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const [formData, setFormData] = useState<IEventForm>(event || eventDefaultValues)
  const [files, setFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [locationType, setLocationType] = useState<"physical" | "online">("physical")
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [pendingEvent, setPendingEvent] = useState<IEventForm | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { startUpload } = useUploadThing("imageUploader")

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getAllCategories()
      setCategories(cats || [])
    }
    fetchCategories()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target as HTMLInputElement
    const value = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address })
    setFormData((prev) => ({ ...prev, location: address }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("✅ Submit fired with values:", formData)

    let uploadedImageUrl = formData.imageUrl

    try {
      setIsSubmitting(true)
      if (files.length > 0) {
        const uploaded = await startUpload(files)
        if (!uploaded) throw new Error("Image upload failed")
        uploadedImageUrl = uploaded[0].url
      }

      const eventData = {
        ...formData,
        imageUrl: uploadedImageUrl,
        location: locationType === "online" ? formData.url || "" : formData.location,
      }

      // ✅ Skip AI enrichment API for now
      setPendingEvent(eventData)
      setShowConfirm(true)
    } catch (err) {
      console.error("Submit failed:", err)
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoadingPreview(false)
      setIsSubmitting(false)
    }
  }

  const handleConfirm = async () => {
    if (!pendingEvent) return
    try {
      setIsSubmitting(true)
      const backendEvent = convertFormToBackend(pendingEvent)

      if (type === "Create") {
        const newEvent = await createEvent({ event: backendEvent, userId, path: "/profile" })
        if (newEvent) router.push("/profile")
      } else if (type === "Update" && eventId) {
        const updated = await updateEvent({
          userId,
          event: { ...backendEvent, _id: eventId },
          path: `/events/${eventId}`,
        })
        if (updated) router.push(`/events/${updated._id}`)
      }
    } catch (error) {
      console.error("Error saving event:", error)
    } finally {
      setShowConfirm(false)
      setPendingEvent(null)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#0b0b12] dark:to-[#0b0b12] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#11121a] rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
            <h1 className="text-3xl font-bold text-center">{type} Event</h1>
            <p className="text-center text-purple-100 mt-2">
              Create an amazing event for your community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Event Details */}
            <div className="space-y-4">
              <label>
                Event Title *
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-[#0f1018] dark:text-white"
                  required
                />
              </label>

              <label>
                Description *
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg min-h-[120px] bg-white dark:bg-[#0f1018] dark:text-white"
                  required
                />
              </label>

              <label>
                Category *
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-[#0f1018] dark:text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <label>Event Image *</label>
                <FileUploader
                  onFieldChange={(url: string) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                  imageUrl={formData.imageUrl}
                  setFiles={setFiles}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <label>
                Start Date & Time *
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-[#0f1018] dark:text-white"
                  required
                />
              </label>

              <label>
                End Date & Time *
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-[#0f1018] dark:text-white"
                  required
                />
              </label>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <label>Event Type *</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLocationType("physical")}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    locationType === "physical" ? "bg-purple-100 dark:bg-purple-900/30 border-purple-500" : "bg-gray-50 dark:bg-[#0f1018] border-gray-300 dark:border-gray-700"
                  }`}
                >
                  Physical Venue
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType("online")}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    locationType === "online" ? "bg-purple-100 dark:bg-purple-900/30 border-purple-500" : "bg-gray-50 dark:bg-[#0f1018] border-gray-300 dark:border-gray-700"
                  }`}
                >
                  Online Event
                </button>
              </div>

              {locationType === "physical" && (
                <MapComponent
                  onLocationSelect={handleLocationSelect}
                  initialLocation={selectedLocation || undefined}
                />
              )}

              {locationType === "online" && (
                <label>
                  Event Link *
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-[#0f1018] dark:text-white"
                    placeholder="https://zoom.us/j/123456789"
                    required
                  />
                </label>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <label>
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleInputChange}
                />{" "}
                Free Event
              </label>

              {!formData.isFree && (
                <label>
                  Price *
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-[#0f1018] dark:text-white"
                    min={0}
                    step={0.01}
                    required
                  />
                </label>
              )}
            </div>

            <button type="submit" disabled={loadingPreview || isSubmitting} className="w-full p-3 bg-purple-600 text-white rounded-lg disabled:opacity-70">
              {loadingPreview || isSubmitting ? (type === "Create" ? "Creating..." : "Updating...") : `${type} Event`}
            </button>
          </form>

          {/* Confirmation Dialog */}
          {showConfirm && pendingEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
              <div className="bg-white dark:bg-[#11121a] p-8 rounded-2xl shadow-2xl max-w-xl w-full space-y-6 relative z-[10000]">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{pendingEvent.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{pendingEvent.description}</p>

                {(pendingEvent.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {(pendingEvent.tags ?? []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded-full text-sm font-medium shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-[#0f1018] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting…' : `Confirm & ${type}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventForm
