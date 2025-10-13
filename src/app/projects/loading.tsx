import Loader from "@/components/Loader"

export default function Loading() {
  return (
    <section className="fixed inset-0 w-screen h-screen overflow-hidden bg-neutral-200 dark:bg-neutral-800">
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    </section>
  );
}