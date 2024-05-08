import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table";
import CategoryForm from "./CategoryForm";
  
  export default function loading() {
	return (
	  <>
	  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		  Categories
		</h1>
    <CategoryForm />
	  <Table className="bg-white rounded-md ">
		<TableHeader>
		<TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Transaction type</TableHead>
          <TableHead>Default</TableHead>
        </TableRow>
		</TableHeader>
		<TableBody>
		{Array(10).fill(1).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="w-[20px] h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="size-8 rounded-full" />
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
	  </>
	);
  }
  