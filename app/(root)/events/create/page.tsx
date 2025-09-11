import EventForm from "@/components/shared/EventForm"
import { auth, currentUser} from "@clerk/nextjs/server";
import { getAllCategories, createCategory } from "@/lib/actions/category.actions";
import { redirect } from "next/navigation";

const CreateEvent = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); // or show an error
  }

  const userId = user.id; // safe now

  // Ensure default categories exist so the client dropdown has options
  const existingCategories = await getAllCategories();
  if (!existingCategories || existingCategories.length === 0) {
    const defaults = [
      'Technology',
      'Business',
      'Health & Wellness',
      'Education',
      'Entertainment',
      'Sports',
      'Community',
      'Arts & Culture',
    ];
    await Promise.all(
      defaults.map(name => createCategory({ categoryName: name }))
    );
  }

  return (
    <>
      {/* <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-purple-600">Create Event</h3>
      </section> */}

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  )
}

export default CreateEvent