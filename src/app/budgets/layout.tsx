import BudgetPeriodForm from "./BudgetPeriodForm";
import NewBudgetForm from "./NewBudgetForm";
import BudgetProvider from "./BudgetContext";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <BudgetProvider>
      <div className="grid grid-cols-12 gap-6 w-full items-start">
        {children}
      </div>
    </BudgetProvider>
  );
}
