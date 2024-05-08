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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function loading() {
  return (
    <>
      <Card className="w-4/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(10)
              .fill(1)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="w-[20px] h-4 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[20px] h-4 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[20px] h-4 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[20px] h-4 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[20px] h-4 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
