import { MyForm } from "../../components/my-form";

export default function MyApplicationsPage() {
  return (
    <section className='p-2 md:space-y-6'>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
        <div className="p-6">
          {/* Content for My Applications will go here */}
          <p>List of applications will be displayed here.</p>
          <MyForm
            userId="1234"
            userName="John Doe"
          />
        </div>
      </div>
    </section>
  );
}