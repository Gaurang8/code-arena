import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";

const data = [
  {
    id: 1,
    task: "Implement Basic Setup & Login Functionality",
    status: "Completed",
  },
  {
    id: 2,
    task: "Implement Logout/Register Functionality",
    status: "In Progress",
  },
  {
    id: 3,
    task: "Implement Users Api for admin panel",
    status: "Pending",
  },
  {
    id: 4,
    task: "Design Schema for platform & implement",
    status: "Pending",
  },
  {
    id: 5,
    task: "Implement Admin Panel UI",
    status: "Pending",
  },
];

const TaskPage = () => {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {data.map((item, index) => (
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>
              {index + 1}. {item.task}
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              size="sm"
              className={`
                ${
                  item.status === "Completed"
                    ? "border-green-500 text-green-500"
                    : item.status === "In Progress"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-gray-500 text-gray-500"
                }
                `}
            >
              {item.status}
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
};

export default TaskPage;
