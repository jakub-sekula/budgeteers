import TransactionForm from "./TransactionForm";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Transactions
      </h1>
      <div className="flex gap-6 w-full items-start">
        <TransactionForm />
        {children}
      </div>
    </>
  );
}
