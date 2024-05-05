import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Transactions
      </h1>
      <Table className="bg-white rounded-md ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(10).fill(1).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="w-[20x] h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[20x] h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[20x] h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[20x] h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[20x] h-4 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              <Skeleton className="w-[20x] h-4 rounded-full" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
